import sys
from pathlib import Path
import io

# Configurar encoding UTF-8 para stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf no está instalado. Instalando...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf", "--quiet"])
    from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
    """Extrae texto de un archivo PDF"""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
        return text
    except Exception as e:
        return f"Error al leer {pdf_path}: {str(e)}"

# Directorio de las rúbricas
rubricas_dir = Path("RubricasHackathon")

# Extraer texto de cada PDF y guardar en archivo
pdf_files = sorted(rubricas_dir.glob("*.pdf"))

if not pdf_files:
    print("No se encontraron archivos PDF en RubricasHackathon")
    sys.exit(1)

output_file = Path("ANALISIS_RUBRICAS.md")
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("# Análisis de Rúbricas de la Hackathon\n\n")
    
    for pdf_file in pdf_files:
        f.write(f"\n{'='*80}\n")
        f.write(f"## ARCHIVO: {pdf_file.name}\n")
        f.write(f"{'='*80}\n\n")
        text = extract_text_from_pdf(pdf_file)
        f.write(text)
        f.write("\n\n")

print(f"Texto extraído y guardado en {output_file}")
print("Puedes revisar el archivo ANALISIS_RUBRICAS.md para ver el contenido completo")

