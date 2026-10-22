package fixture

// The compiled role remains independent of the encrypted authentication token.
const CredentialSource = "credentials.vault"
const CredentialReference = "service_token"

func AllowedRole(_ map[string]string) string { return "reader" }
