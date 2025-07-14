#!/bin/bash

# Detecta o sistema e define o comando do sed
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_CMD="sed -i ''"
else
  SED_CMD="sed -i"
fi

# Atualiza o backend/package.json
if [ -f "backend/package.json" ]; then
  # Primeiro, verifica se já tem a licença
  if ! grep -q '"license": "MIT"' backend/package.json; then
    # Se não tiver, adiciona após a linha do name
    $SED_CMD '/"name": "flashcard-backend",/a\  "license": "MIT",' backend/package.json
    echo "✅ Licença adicionada ao backend/package.json"
  else
    echo "ℹ️  Licença já existe no backend/package.json"
  fi
else
  echo "⚠️ Arquivo backend/package.json não encontrado"
fi

# Atualiza o frontend/package.json
if [ -f "frontend/package.json" ]; then
  # Primeiro, verifica se já tem a licença
  if ! grep -q '"license": "MIT"' frontend/package.json; then
    # Se não tiver, adiciona após a linha do name
    $SED_CMD '/"name": "frontend",/a\  "license": "MIT",' frontend/package.json
    echo "✅ Licença adicionada ao frontend/package.json"
  else
    echo "ℹ️  Licença já existe no frontend/package.json"
  fi
else
  echo "⚠️ Arquivo frontend/package.json não encontrado"
fi
