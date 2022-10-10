export class SignKeyService {
  private signedImages: Map<string, string | undefined> = new Map()
  private loading: Map<string, boolean> = new Map()

  public async get(id: string): Promise<string | undefined> {
    if (id && !this.signedImages.get(id)) {
      if (!this.loading.get(id)) {
        this.loading.set(id, true)
        await this.refreshPost(id)
      }
    }
    return this.signedImages.get(id)
  }

  public async refreshPost(id: string): Promise<void> {
    const res = await fetch(`/api/get-image?imageKey=${id}`)
    const json = await res.json()
    this.signedImages.set(id, json)
  }
}

export const signKeyService = new SignKeyService()
