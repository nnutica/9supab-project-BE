/* AI Response structure */
export interface AiResponse {
  status: 'success' | 'error';
  convertedText: string;
  explanation: string;
  alternatives: string[];
}
