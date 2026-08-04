# Scaffold Cognito authentication
$ belt generate auth

#   create  infrastructure/modules/app/cognito.tf
#   create  infrastructure/modules/app/cognito_outputs.tf
#   update  infrastructure/modules/app/main.tf (added cognito_user_pool_arns)
#   create  frontend/src/lib/auth.js
#   create  frontend/src/lib/apiClient.js
#   create  frontend/src/pages/auth/Login.jsx
#   create  frontend/src/components/ProtectedRoute.jsx
#   ✓      npm dependency installed
