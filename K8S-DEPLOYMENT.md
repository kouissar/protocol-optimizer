# Kubernetes Deployment Guide

This guide will help you deploy the Protocol Optimizer application to your Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (v1.19+)
- `kubectl` configured to access your cluster
- Docker image built and available in your cluster (or use `imagePullPolicy: Never` for local images)

## Deployment Steps

### 1. Create the JWT Secret

**IMPORTANT:** Create a strong, random secret key for JWT token signing.

```bash
# Generate a random secret (recommended)
kubectl create secret generic react-app-secrets \
  --from-literal=jwt-secret=$(openssl rand -base64 32)

# Or use a custom secret
kubectl create secret generic react-app-secrets \
  --from-literal=jwt-secret=your-strong-secret-key-here
```

**Verify the secret:**

```bash
kubectl get secret react-app-secrets
```

### 2. Create Persistent Volume Claim

The application needs persistent storage for the `db.json` file:

```bash
kubectl apply -f pvc.yaml
```

**Verify the PVC:**

```bash
kubectl get pvc react-app-db-pvc
```

**Note:** If your cluster uses a specific storage class, edit `pvc.yaml` and uncomment/update the `storageClassName` field.

### 3. Build and Load Docker Image

If using a local cluster (like minikube or kind), you need to build and load the image:

```bash
# Build the Docker image
docker build -t optimizer-app .

# For minikube
minikube image load optimizer-app

# For kind
kind load docker-image optimizer-app

# For Docker Desktop Kubernetes
# The image should be available if built locally
```

### 4. Deploy the Application

```bash
# Deploy the application
kubectl apply -f deployment.yaml

# Deploy the service
kubectl apply -f service.yaml
```

### 5. Verify Deployment

```bash
# Check deployment status
kubectl get deployment react-app-deployment

# Check pods
kubectl get pods -l app=react-app

# Check service
kubectl get service react-app-service

# View pod logs
kubectl logs -l app=react-app --tail=50 -f
```

### 6. Access the Application

**If using LoadBalancer:**

```bash
# Get external IP
kubectl get service react-app-service

# Access via external IP on port 80
```

**If using port-forward (for testing):**

```bash
kubectl port-forward service/react-app-service 8080:80
# Access at http://localhost:8080
```

**If using NodePort or Ingress:**
Configure according to your cluster setup.

## Configuration

### Environment Variables

The deployment uses the following environment variables:

- `PORT`: Server port (default: 5000)
- `DB_PATH`: Database file path (default: `/app/server/data/db.json` in K8s)
- `JWT_SECRET`: JWT signing secret (from Kubernetes secret)

### Resource Limits

Default resource configuration:

- **Requests**: 128Mi memory, 100m CPU
- **Limits**: 512Mi memory, 500m CPU

Adjust these in `deployment.yaml` based on your needs.

### Storage

- **PVC Size**: 1Gi (configurable in `pvc.yaml`)
- **Storage Location**: `/app/server/data/db.json` (mounted at `/app/server/data`)
- **Access Mode**: ReadWriteOnce (single pod access)
- **Volume Mount**: The persistent volume is mounted at `/app/server/data` to preserve server code files

## Health Checks

The deployment includes:

- **Liveness Probe**: Checks `/api/health` every 10 seconds
- **Readiness Probe**: Checks `/api/health` every 5 seconds

Both probes ensure the application is running correctly.

## Scaling

To scale the application:

```bash
# Scale to 3 replicas
kubectl scale deployment react-app-deployment --replicas=3
```

**Important:** With `ReadWriteOnce` storage, only one pod can mount the PVC. For multiple replicas, you'll need to:

1. Use a storage class that supports `ReadWriteMany` (like NFS)
2. Or use a shared database solution (PostgreSQL, MongoDB, etc.)

## Updating the Application

```bash
# Rebuild and reload the image
docker build -t optimizer-app .
minikube image load optimizer-app  # or equivalent for your setup

# Restart the deployment
kubectl rollout restart deployment react-app-deployment

# Or update the image
kubectl set image deployment/react-app-deployment react-app=optimizer-app:new-tag
```

## Backup and Restore

### Backup Database

```bash
# Get the pod name
POD_NAME=$(kubectl get pod -l app=react-app -o jsonpath='{.items[0].metadata.name}')

# Copy db.json from pod
kubectl cp $POD_NAME:/app/server/data/db.json ./db-backup-$(date +%Y%m%d).json
```

### Restore Database

```bash
# Copy db.json to pod
kubectl cp ./db-backup.json $POD_NAME:/app/server/data/db.json

# Restart the pod to reload
kubectl delete pod $POD_NAME
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod -l app=react-app

# Check logs
kubectl logs -l app=react-app
```

### Database Issues

```bash
# Check if PVC is bound
kubectl get pvc react-app-db-pvc

# Check pod volume mounts
kubectl describe pod -l app=react-app | grep -A 10 "Mounts:"
```

### Secret Issues

```bash
# Verify secret exists
kubectl get secret react-app-secrets

# Check if secret is mounted
kubectl describe pod -l app=react-app | grep -A 5 "Environment:"
```

### Health Check Failures

```bash
# Test health endpoint manually
kubectl exec -it $(kubectl get pod -l app=react-app -o jsonpath='{.items[0].metadata.name}') -- \
  wget -qO- http://localhost:5000/api/health
```

## Cleanup

To remove all resources:

```bash
# Delete deployment and service
kubectl delete -f deployment.yaml
kubectl delete -f service.yaml

# Delete PVC (WARNING: This will delete your database!)
kubectl delete -f pvc.yaml

# Delete secret
kubectl delete secret react-app-secrets
```

## Production Considerations

1. **Use a proper image registry** instead of `imagePullPolicy: Never`
2. **Set up Ingress** for proper domain routing
3. **Configure TLS/SSL** certificates
4. **Set up monitoring** (Prometheus, Grafana)
5. **Configure logging** aggregation
6. **Use a managed database** for production (PostgreSQL, MongoDB)
7. **Set up automated backups** for the database
8. **Use resource quotas** and limit ranges
9. **Configure network policies** for security
10. **Use a secrets management system** (Vault, Sealed Secrets)

## Files Reference

- `deployment.yaml` - Main application deployment
- `service.yaml` - Service definition (LoadBalancer)
- `pvc.yaml` - Persistent volume claim for database
- `secret.yaml.example` - Example secret template
- `Dockerfile` - Container image definition
