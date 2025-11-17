"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Mail, Phone, User, LogIn, UserPlus } from "lucide-react";
import { createAccount, login } from "@/lib/auth";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;

      if (mode === "signup") {
        result = createAccount(emailOrPhone, name);
      } else {
        result = login(emailOrPhone);
      }

      if (result.success) {
        toast.success(result.message);
        onSuccess();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao processar sua solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmail = emailOrPhone.includes("@");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 relative animate-fade-in">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {mode === "signup" ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <LogIn className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {mode === "signup" ? "Criar Conta" : "Fazer Login"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {mode === "signup"
              ? "Crie sua conta para acessar todos os recursos"
              : "Entre com seu e-mail ou telefone"}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="emailOrPhone">E-mail ou Telefone</Label>
            <div className="relative">
              {isEmail || !emailOrPhone ? (
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              ) : (
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              )}
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="seu@email.com ou (11) 99999-9999"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 Use e-mail ou número de telefone
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === "signup" ? (
              "Criar Conta"
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === "signup" ? "Já tem uma conta?" : "Não tem uma conta?"}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              {mode === "signup" ? "Fazer Login" : "Criar Conta"}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
