import serverless from "serverless-http"
import { app } from "./" 
import "mysql"

export const handler = serverless(app);