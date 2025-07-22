

// Alternative approach using direct API calls
export class CoinbaseCommerceAPI {
  private apiKey: string;
  private baseUrl = "https://api.commerce.coinbase.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCharge(chargeData: {
    name: string;
    description: string;
    local_price: {
      amount: string;
      currency: string;
    };
    pricing_type: "fixed_price";
    metadata?: Record<string, string>;
  }) {
    const response = await fetch(`${this.baseUrl}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": this.apiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Coinbase API Error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.data;
  }

  async getCharge(chargeId: string) {
    const response = await fetch(`${this.baseUrl}/charges/${chargeId}`, {
      method: "GET",
      headers: {
        "X-CC-Api-Key": this.apiKey,
        "X-CC-Version": "2018-03-22",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Coinbase API Error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.data;
  }
}

export const coinbaseAPI = new CoinbaseCommerceAPI(
  process.env.COINBASE_API_KEY!
);


