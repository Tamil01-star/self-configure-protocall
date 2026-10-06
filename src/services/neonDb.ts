import { neon } from '@neondatabase/serverless';

const DEFAULT_NEON_URL = 
  import.meta.env.VITE_NEON_DATABASE_URL || 
  'postgresql://neondb_owner:npg_cxd3nW6oSmYK@ep-plain-math-b5jlzssb-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export interface NeonLogRecord {
  id: number;
  timestamp: string;
  protocol: string;
  confidence: number;
  raw_json: any;
}

class NeonDatabaseService {
  private connectionUrl: string;

  constructor() {
    this.connectionUrl = DEFAULT_NEON_URL;
  }

  public setConnectionUrl(url: string) {
    this.connectionUrl = url;
  }

  public getConnectionUrl(): string {
    return this.connectionUrl;
  }

  /**
   * Tests the connection to Neon PostgreSQL and checks if `autoscope_logs` exists.
   */
  public async testConnection(): Promise<{ success: boolean; message: string; rowCount?: number }> {
    try {
      const sql = neon(this.connectionUrl);
      const result = await sql`
        SELECT COUNT(*)::int as count FROM autoscope_logs
      `;
      const count = result[0]?.count ?? 0;
      return {
        success: true,
        message: `Connected to Neon PostgreSQL. Total logged events: ${count}`,
        rowCount: count,
      };
    } catch (err: any) {
      // Table might not exist yet or connection issue
      if (err?.message?.includes('relation "autoscope_logs" does not exist')) {
        return {
          success: true,
          message: 'Connected to Neon PostgreSQL (table autoscope_logs pending creation by bridge script).',
          rowCount: 0,
        };
      }
      return {
        success: false,
        message: `Neon Connection Error: ${err?.message || String(err)}`,
      };
    }
  }

  /**
   * Fetches historical logs stored in Neon DB.
   */
  public async fetchLogs(limit = 50): Promise<NeonLogRecord[]> {
    try {
      const sql = neon(this.connectionUrl);
      const rows = await sql`
        SELECT id, timestamp, protocol, confidence, raw_json 
        FROM autoscope_logs 
        ORDER BY id DESC 
        LIMIT ${limit}
      `;
      return rows as NeonLogRecord[];
    } catch (err) {
      console.warn('Unable to fetch Neon DB logs:', err);
      return [];
    }
  }

  /**
   * Uploads a telemetry record directly to Neon DB from the WebSerial frontend if needed.
   */
  public async saveLog(protocol: string, confidence: number, rawPayload: any): Promise<boolean> {
    try {
      const sql = neon(this.connectionUrl);
      await sql`
        INSERT INTO autoscope_logs (protocol, confidence, raw_json)
        VALUES (${protocol}, ${confidence}, ${JSON.stringify(rawPayload)})
      `;
      return true;
    } catch (err) {
      console.error('Failed to save log to Neon DB:', err);
      return false;
    }
  }
}

export const neonDb = new NeonDatabaseService();
