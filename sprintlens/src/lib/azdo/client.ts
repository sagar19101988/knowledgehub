import { AzDOSettings } from '@/types/azdo';

export class AzDOClient {
  private url: string;
  private authHeader: string;

  constructor(settings: AzDOSettings) {
    if (!settings.orgUrl || !settings.pat) {
      throw new Error('AzDO Organization URL and PAT are required.');
    }
    
    let cleanUrl = settings.orgUrl.trim().replace(/\/+$/, '');
    
    try {
      const parsedUrl = new URL(cleanUrl);
      if (parsedUrl.hostname === 'dev.azure.com') {
        const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 1) {
          cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}/${pathParts[0]}`;
        }
      }
    } catch (e) {
      // Let it pass
    }

    this.url = cleanUrl;
    this.authHeader = `Basic ${Buffer.from(`:${settings.pat.trim()}`).toString('base64')}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const resp = await fetch(`${this.url}/_apis/projects?$top=1&api-version=6.0`, {
        headers: { Authorization: this.authHeader },
        cache: 'no-store'
      });
      return resp.ok;
    } catch (e) {
      return false;
    }
  }

  async getCoreApi() {
    return {
      getProjects: async () => {
        // Fallback version array for On-Prem TFS compatibility
        const API_VERSIONS = ['7.0', '6.0', '5.1', '5.0', '3.0'];
        let lastError = null;
        
        for (const version of API_VERSIONS) {
           try {
             const resp = await fetch(`${this.url}/_apis/projects?api-version=${version}`, {
               headers: { Authorization: this.authHeader },
               cache: 'no-store'
             });
             
             if (resp.status === 401 || resp.status === 403) {
                // If pure Auth failure, no need to try other API versions
                const txt = await resp.text().catch(() => "");
                throw new Error(`HTTP ${resp.status} Unauthorized. Token is definitively rejected by target server. ${txt}`);
             }
             
             if (resp.ok) {
               const data = await resp.json();
               return data.value || [];
             }
           } catch (e: any) {
             lastError = e;
             if (e.message.includes('Unauthorized')) throw e; // bubble up Auth errs immediately
           }
        }
        throw new Error(`Exhausted API versions. Last error: ${lastError?.message}`);
      }
    };
  }
}
