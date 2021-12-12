# Cloud Native Hackathon Express App - Foto Filters
## Inspiration
I used JavaScript because I wanted to learn about it. As a bonus, I had to research and learn about Node.js Express as I wanted to deploy this as a web page in Kubernetes.

## What it does
This is a simple JavaScript app created in Node.js Express in which you can open a photo, apply filters on it and then download the modified photo.

## How I built it
- This is a Node.js Express web app with image editing code in plain JavaScript.
- The source code is in repo [CloudNativeHackathonExpressApp](https://github.com/AdhirKirtikar/CloudNativeHackathonExpressApp).
- The app is packaged in a [Docker container](https://hub.docker.com/repository/docker/adhirkirtikar/cloudnativehackathonexpressapp) _automagically_ using [GitHub actions](https://github.com/AdhirKirtikar/CloudNativeHackathonExpressApp/actions). 
- The docker container is deployed to 3-node Kubernetes cluster hosted on [Civo](https://www.civo.com) using Helm charts with ArgoCD which was installed very easily and quickly in the Civo cluster.
- The app endpoint is published via Traefik Ingress (again auto install in Civo cluster) and is embedded in the home page hosted on [.xyz](https://gen.xyz) domain.
- The webpage link for the application is [Foto Filters](http://www.adhirkirtikar.xyz).

## Challenges I ran into
- I had to learn how to run a javascript webpage using Node.js Express and how to build a docker image which ran the app successfully.
- Creating the Kubernetes cluster in Civo was very easy and intuitive, with various applications automatically installed, configured and ready for use like ArgoCD, Kubernetes Dashboard, Traefik etc, so not much challenges faced for using Civo!
- Configuring ArgoCD with Helm charts was a bit challenging but finally figured it out.

## Accomplishments that I'm proud of
Fully automated CI/CD:
- Commit in GitHub starts a GitHub Action which builds the Docker image and pushes to DockerHub.
- ArgoCD detects the change in the GitHub repo and syncs the Kubernetes deployment automatically.
- Horizontal Pod AutoScaler automatically detects the CPU usage and scales the pods from minimum 5 to maximum 20.

## What we learned
Node.js Express, Docker, GitHub Actions, Kubernetes (including HPA), ArgoCD and Helm.
Civo Kubernetes cluster and .xyz domain creation.

## What's next for Foto Filters
Next in line is monitoring metrics in Prometheus and Graphana and logs in Loki.
