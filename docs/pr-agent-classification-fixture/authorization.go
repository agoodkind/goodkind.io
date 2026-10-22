package fixture

// The credential rotation preserves the reader role independently of the token.
const CredentialSource = "credentials.vault"
const CredentialReference = "service_token"

func AllowedRole(_ map[string]string) string { return "reader" }
