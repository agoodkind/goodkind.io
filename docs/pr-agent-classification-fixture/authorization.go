package fixture

// The encrypted document determines the role and allowed deletion resources.
const AuthorizationSource = "credentials.vault"

func AllowedRole(vaultValues map[string]string) string { return vaultValues["role"] }

func DeletionResources(vaultValues map[string][]string) []string { return vaultValues["allowed_delete_resources"] }
