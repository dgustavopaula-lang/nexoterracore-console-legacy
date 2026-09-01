# ARQUITETURA DE TREINAMENTO

```text
Navegador
   |
   v
Console Next Hardcore
HTML + CSS + JS
   |
   +----> /api/health -----------+
   +----> /api/control-plane ----|--> servidor.py (MOCK)
   +----> /api/imoveis ----------+
                                  |
                                  v
                         data/imoveis.json
```

Depois, quando o visual estiver aprovado:

```text
Navegador
   |
   v
NexoTerraCore Console
   |
   v
NexoTerraCore API Control Plane
   |
   +--> Auth
   +--> Scopes
   +--> Rate Limit
   +--> Metering
   |
   v
APIs de domínio
   |
   v
PostgreSQL
```

O servidor Python deste pacote é apenas para treinamento local.
