# How to Access Your Application in Kubernetes

## ✅ Yes, the Backend is Included!

Your deployment includes **both frontend and backend** in a single container:

- **Frontend (React)**: Built and served as static files
- **Backend (Node.js/Express)**: Handles API routes (`/api/*`)
- **Single Server**: `server.js` serves both the React app and API endpoints on port 5000

The Dockerfile builds the React app and includes the Node.js server, which serves everything together.

---

## 🌐 How to Access Your Application

The access method depends on your Kubernetes cluster type. Here are the options:

### Method 1: LoadBalancer (Cloud Clusters - AWS, GCP, Azure)

If your cluster supports LoadBalancer services (most cloud providers):

```bash
# Get the external IP address
kubectl get service react-app-service

# Wait for EXTERNAL-IP to be assigned (may take 1-2 minutes)
# Then access at: http://<EXTERNAL-IP>
```

**Example:**

```
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)
react-app-service   LoadBalancer   10.96.123.45    203.0.113.10     80:31234/TCP
```

Access at: `http://203.0.113.10` or `http://203.0.113.10:80`

---

### Method 2: Port Forward (Any Cluster - For Testing)

If you don't have a LoadBalancer or want to test locally:

```bash
# Forward local port 8080 to service port 80
kubectl port-forward service/react-app-service 8080:80
```

Then access at: **http://localhost:8080**

**Note:** This only works while the command is running. Press `Ctrl+C` to stop.

---

### Method 3: NodePort (Alternative)

If LoadBalancer isn't available, you can change the service type:

```bash
# Edit the service
kubectl edit service react-app-service

# Change type from LoadBalancer to NodePort
```

Then access via any node's IP on the assigned NodePort (usually 30000-32767).

---

### Method 4: Ingress (Production - Recommended)

For production with a domain name, use Ingress:

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: react-app-ingress
spec:
  rules:
    - host: your-domain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: react-app-service
                port:
                  number: 80
```

Then access at: `http://your-domain.com`

---

## 🔍 Verify Everything is Running

### 1. Check Pod Status

```bash
kubectl get pods -l app=react-app
```

Should show:

```
NAME                                  READY   STATUS    RESTARTS   AGE
react-app-deployment-xxxxxxxxxx-xxxxx 1/1     Running   0          2m
```

### 2. Check Service

```bash
kubectl get service react-app-service
```

### 3. Check Logs

```bash
# View pod logs
kubectl logs -l app=react-app --tail=50 -f
```

You should see:

```
🚀 Server running on port 5000
📊 Health check: http://localhost:5000/api/health
💾 Using file-based storage: /app/server/data/db.json
```

### 4. Test Health Endpoint

```bash
# Get pod name
POD_NAME=$(kubectl get pod -l app=react-app -o jsonpath='{.items[0].metadata.name}')

# Test health endpoint
kubectl exec $POD_NAME -- wget -qO- http://localhost:5000/api/health
```

Should return:

```json
{ "status": "OK", "message": "Huberman Protocol API is running" }
```

---

## 📱 What You'll See

Once accessed, you'll see:

1. **React Frontend**: The full Protocol Optimizer application UI
2. **API Endpoints**: All backend routes work at `/api/*`
   - `/api/health` - Health check
   - `/api/auth/register` - User registration
   - `/api/auth/login` - User login
   - `/api/user/protocols` - User protocols
   - etc.

---

## 🔧 Troubleshooting Access Issues

### Service Has No External IP

**Problem:** `kubectl get service` shows `<pending>` for EXTERNAL-IP

**Solutions:**

- Wait 2-3 minutes (cloud providers need time to provision)
- Use port-forward instead: `kubectl port-forward service/react-app-service 8080:80`
- Check if your cluster supports LoadBalancer (minikube doesn't by default)

### Can't Access via Port Forward

**Problem:** Port forward connection refused

**Solutions:**

```bash
# Check if pod is running
kubectl get pods -l app=react-app

# Check pod logs for errors
kubectl logs -l app=react-app

# Verify service is pointing to correct pods
kubectl describe service react-app-service
```

### 404 or Connection Refused

**Problem:** Can access but get errors

**Solutions:**

```bash
# Check if the React build exists in the container
kubectl exec -it $(kubectl get pod -l app=react-app -o jsonpath='{.items[0].metadata.name}') -- ls -la /app/build

# Check if server is listening on port 5000
kubectl exec -it $(kubectl get pod -l app=react-app -o jsonpath='{.items[0].metadata.name}') -- netstat -tlnp
```

---

## 🎯 Quick Access Commands

```bash
# Get service URL (if LoadBalancer)
kubectl get service react-app-service -o jsonpath='http://{.status.loadBalancer.ingress[0].ip}'

# Port forward (quick test)
kubectl port-forward service/react-app-service 8080:80

# View logs
kubectl logs -l app=react-app -f

# Check everything
kubectl get all -l app=react-app
```

---

## 📊 Service Architecture

```
Internet/User
    ↓
LoadBalancer Service (Port 80)
    ↓
Pod (Container Port 5000)
    ↓
┌─────────────────────────┐
│   server.js (Express)   │
│                         │
│  /api/* → API Routes    │
│  /*     → React App     │
│                         │
│  - Serves React build   │
│  - Handles API calls    │
│  - Single server!       │
└─────────────────────────┘
```

---

## ✅ Summary

- **Backend is included**: Yes! Everything runs in one container
- **Access method**: Depends on your cluster (LoadBalancer, port-forward, or Ingress)
- **Default port**: Service exposes on port 80, container runs on 5000
- **Single entry point**: One URL serves both frontend and API


