
const tokenID = "access_token"
const refreshTokenId = "refresh_token"

export namespace JWT {
  export function fetch(): {token: string, refresh_token: string} {
    return {token: localStorage.getItem(tokenID), refresh_token: localStorage.getItem(refreshTokenId)}
  }

  export function set(tokens: {token: string, refresh_token: string}) {
    localStorage.setItem(tokenID, tokens.token);
    localStorage.setItem(refreshTokenId, tokens.refresh_token);
  }

  export function clear() {
    localStorage.removeItem(tokenID);
    localStorage.removeItem(refreshTokenId);
  }
}