// Sistema de autenticação com e-mail ou telefone

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Verificar se usuário já existe
export function userExists(emailOrPhone: string): boolean {
  const users = getAllUsers();
  return users.some(
    (user) => user.email === emailOrPhone || user.phone === emailOrPhone
  );
}

// Obter todos os usuários
function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  const usersData = localStorage.getItem("users");
  return usersData ? JSON.parse(usersData) : [];
}

// Salvar usuário
function saveUser(user: User): void {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

// Criar conta
export function createAccount(
  emailOrPhone: string,
  name: string
): AuthResponse {
  // Validar entrada
  if (!emailOrPhone || !name) {
    return {
      success: false,
      message: "Por favor, preencha todos os campos",
    };
  }

  // Verificar se já existe
  if (userExists(emailOrPhone)) {
    return {
      success: false,
      message: "Já existe uma conta com este e-mail ou telefone",
    };
  }

  // Determinar se é e-mail ou telefone
  const isEmail = emailOrPhone.includes("@");

  // Criar novo usuário
  const newUser: User = {
    id: Date.now().toString(),
    ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }),
    name,
    createdAt: new Date().toISOString(),
  };

  // Salvar usuário
  saveUser(newUser);

  // Fazer login automático
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  return {
    success: true,
    message: "Conta criada com sucesso!",
    user: newUser,
  };
}

// Fazer login
export function login(emailOrPhone: string): AuthResponse {
  // Validar entrada
  if (!emailOrPhone) {
    return {
      success: false,
      message: "Por favor, informe seu e-mail ou telefone",
    };
  }

  // Buscar usuário
  const users = getAllUsers();
  const user = users.find(
    (u) => u.email === emailOrPhone || u.phone === emailOrPhone
  );

  if (!user) {
    return {
      success: false,
      message: "Conta não encontrada. Crie uma conta primeiro.",
    };
  }

  // Salvar sessão
  localStorage.setItem("currentUser", JSON.stringify(user));

  return {
    success: true,
    message: "Login realizado com sucesso!",
    user,
  };
}

// Fazer logout
export function logout(): void {
  localStorage.removeItem("currentUser");
}

// Obter usuário atual
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("currentUser");
  return userData ? JSON.parse(userData) : null;
}

// Verificar se está logado
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
