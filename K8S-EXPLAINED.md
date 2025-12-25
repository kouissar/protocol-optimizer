# Kubernetes Concepts Explained

This document explains why you need a **Secret** and a **PVC (PersistentVolumeClaim)** for your deployment.

---

## 🔐 What is a Secret and Why Do You Need It?

### What is a Kubernetes Secret?

A **Secret** is a Kubernetes object that stores sensitive data (like passwords, API keys, tokens) in an encrypted format. It's a secure way to pass sensitive information to your pods without hardcoding it in your deployment files.

### Why Do You Need It?

Your application uses **JWT (JSON Web Tokens)** for user authentication. The JWT secret is used to:

- **Sign** tokens when users log in
- **Verify** tokens when users make authenticated requests

**Without a secret:**

- If you hardcode the JWT secret in your deployment file, anyone with access to the file can see it
- If the secret is weak or predictable, attackers could forge authentication tokens
- You can't easily change the secret without modifying deployment files

**With a Kubernetes Secret:**

- ✅ The secret is stored securely and encrypted
- ✅ You can change it without modifying your deployment
- ✅ It's not visible in your deployment YAML files
- ✅ Follows security best practices

### How It Works in Your App

```yaml
# In deployment.yaml (line 33-37)
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: react-app-secrets # References the secret
        key: jwt-secret # The key inside the secret
```

When the pod starts, Kubernetes automatically injects the secret value as an environment variable `JWT_SECRET`, which your Node.js app reads.

### How to Create It

```bash
# Generate a strong random secret
kubectl create secret generic react-app-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 32)
```

This creates a secret named `react-app-secrets` with a key `jwt-secret` containing a random 32-byte base64-encoded string.

---

## 💾 What is a PVC and Why Do You Need It?

### What is a PersistentVolumeClaim (PVC)?

A **PVC** is a request for storage in Kubernetes. Think of it as:

- A **"reservation"** for disk space
- A way to tell Kubernetes: _"I need 1GB of storage that persists even if my pod restarts"_

### The Problem It Solves

Your application stores all user data in a file called `db.json` using Lowdb. Here's what happens:

**Without a PVC (using only container storage):**

```
Pod starts → Creates db.json → User registers → Data saved
Pod crashes/restarts → Container storage is wiped → db.json is GONE → All user data LOST! 😱
```

**With a PVC (using persistent storage):**

```
Pod starts → Mounts PVC → Creates db.json on PVC → User registers → Data saved
Pod crashes/restarts → PVC still exists → db.json still there → All user data SAFE! ✅
```

### How It Works

1. **PVC Creation**: You create a PVC that requests 1GB of storage
2. **Kubernetes Provisioning**: Kubernetes finds available storage and creates a PersistentVolume (PV)
3. **Pod Mount**: When your pod starts, it mounts the PVC as a volume
4. **Data Persistence**: Your `db.json` file is stored on the persistent volume, not in the container

### Visual Representation

```
┌─────────────────────────────────────┐
│         Kubernetes Cluster          │
│                                     │
│  ┌──────────────┐                  │
│  │     Pod      │                  │
│  │              │                  │
│  │  /app/server │                  │
│  │     /data    │◄───mounts───┐    │
│  │              │             │    │
│  │  db.json     │             │    │
│  └──────────────┘             │    │
│                               │    │
│                        ┌──────▼──────┐
│                        │     PVC     │
│                        │  (1GB disk) │
│                        │             │
│                        │  db.json    │
│                        │  (persists) │
│                        └─────────────┘
│                                     │
└─────────────────────────────────────┘
```

### Why ReadWriteOnce?

Your PVC uses `ReadWriteOnce` access mode, which means:

- ✅ Only **one pod** can mount it at a time
- ✅ Perfect for your single-pod deployment
- ✅ Prevents database corruption from multiple pods writing simultaneously

### How to Create It

```bash
kubectl apply -f pvc.yaml
```

This creates a PVC that requests 1GB of storage. Kubernetes will automatically provision the storage based on your cluster's storage class.

---

## 📋 Summary

| Component  | What It Is                                     | Why You Need It                     | What Happens Without It               |
| ---------- | ---------------------------------------------- | ----------------------------------- | ------------------------------------- |
| **Secret** | Encrypted storage for sensitive data (JWT key) | Secure authentication token signing | Security risk, tokens could be forged |
| **PVC**    | Request for persistent disk storage            | Keep user data when pod restarts    | All user data lost on pod restart     |

---

## 🔄 The Complete Flow

1. **Create Secret**: Store your JWT secret securely

   ```bash
   kubectl create secret generic react-app-secrets --from-literal=jwt-secret=...
   ```

2. **Create PVC**: Reserve storage for your database

   ```bash
   kubectl apply -f pvc.yaml
   ```

3. **Deploy App**: Kubernetes uses both:

   - Injects the secret as `JWT_SECRET` environment variable
   - Mounts the PVC at `/app/server/data` for database storage

4. **Result**:
   - ✅ Secure authentication
   - ✅ Persistent user data
   - ✅ Data survives pod restarts

---

## 🎯 Quick Reference

### Check if Secret exists:

```bash
kubectl get secret react-app-secrets
```

### Check if PVC exists:

```bash
kubectl get pvc react-app-db-pvc
```

### View Secret (base64 encoded):

```bash
kubectl get secret react-app-secrets -o yaml
```

### View PVC details:

```bash
kubectl describe pvc react-app-db-pvc
```

---

## ⚠️ Important Notes

1. **Secret**: Once created, the secret persists until you delete it. If you delete and recreate the pod, the secret is still there.

2. **PVC**: The data in the PVC persists even if you:

   - Delete the pod
   - Delete the deployment
   - Restart the cluster (depending on storage type)

   **To delete data**: You must explicitly delete the PVC (⚠️ this deletes all user data!)

3. **Backup**: Always backup your PVC data before making changes:
   ```bash
   kubectl cp <pod-name>:/app/server/data/db.json ./backup.json
   ```


