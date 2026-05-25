from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import ast

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "DocuMind AI Running 🚀"}


@app.post("/generate-docs/")
async def generate_docs(file: UploadFile = File(...)):

    content = await file.read()

    try:
        code = content.decode("utf-8")
    except:
        return {
            "documentation": "Unable to read uploaded file."
        }

    filename = file.filename

    # Parse code
    try:
        tree = ast.parse(code)
    except Exception as e:
        return {
            "documentation": f"Code parsing failed: {str(e)}"
        }

    imports = []
    functions = []
    classes = []

    # Analyze AST
    for node in ast.walk(tree):

        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)

        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.append(node.module)

        elif isinstance(node, ast.FunctionDef):
            functions.append(node.name)

        elif isinstance(node, ast.ClassDef):
            classes.append(node.name)

    # Start Documentation
    documentation = f"# 📘 Documentation for {filename}\n\n"

    documentation += "## 📌 Project Summary\n\n"
    documentation += "This uploaded source code was analyzed automatically using DocuMind AI.\n\n"

    documentation += "---\n\n"

    # Libraries
    documentation += "## ⚙️ Technologies & Libraries\n\n"

    if imports:
        for item in imports:
            documentation += f"- {item}\n"
    else:
        documentation += "- No external libraries detected\n"

    documentation += "\n---\n\n"

    # Functions
    documentation += "## 🔍 Functions Detected\n\n"

    if functions:
        for func in functions:
            documentation += f"- `{func}()`\n"
    else:
        documentation += "- No custom functions found\n"

    documentation += "\n---\n\n"

    # Classes
    documentation += "## 🏛 Classes Detected\n\n"

    if classes:
        for cls in classes:
            documentation += f"- `{cls}`\n"
    else:
        documentation += "- No classes found\n"

    documentation += "\n---\n\n"

    # Logic
    documentation += "## 🧠 Logic Analysis\n\n"

    if "while" in code:
        documentation += "- Uses loop-based execution\n"

    if "for " in code:
        documentation += "- Uses iterative loops\n"

    if "if " in code:
        documentation += "- Uses conditional logic\n"

    if "input(" in code:
        documentation += "- Accepts user input\n"

    if "print(" in code:
        documentation += "- Displays console output\n"

    if "random" in code:
        documentation += "- Includes randomized behavior\n"

    documentation += "\n---\n\n"

    # Project Type
    documentation += "## 🚀 Project Type\n\n"

    if "fastapi" in code.lower():
        documentation += "- Backend API Application\n"

    elif "flask" in code.lower():
        documentation += "- Flask Web Application\n"

    elif "pygame" in code.lower():
        documentation += "- Python Game Application\n"

    elif "tkinter" in code.lower():
        documentation += "- GUI Desktop Application\n"

    else:
        documentation += "- General Python Application\n"

    documentation += "\n---\n\n"

    # Setup
    documentation += "## ⚡ Setup Instructions\n\n"
    documentation += "1. Install Python 3.x\n"
    documentation += "2. Install required libraries\n"
    documentation += "3. Run the application using:\n\n"
    documentation += "python filename.py\n"

    documentation += "\n---\n\n"

    # Conclusion
    documentation += "## 💡 Conclusion\n\n"
    documentation += "The uploaded source code was successfully analyzed and documented automatically using DocuMind AI.\n"

    return {
        "documentation": documentation
    }