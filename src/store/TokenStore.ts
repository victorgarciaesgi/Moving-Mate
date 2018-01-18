
const tokenID = "access_token"

export namespace JWT {
  export function fetch(): string {
    return localStorage.getItem(tokenID);
  }

  export function set(token: string) {
    localStorage.setItem(tokenID, token);
  }

  export function clear() {
    localStorage.removeItem(tokenID);
  }
}