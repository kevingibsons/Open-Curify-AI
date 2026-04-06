install-backend:
	cd backend && pip install -r requirements.txt

install-inference:
	cd backend && pip install -r requirements.inference.txt

install-frontend:
	cd frontend && npm install

dev-backend:
	cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload

dev-frontend:
	cd frontend && npm run dev
