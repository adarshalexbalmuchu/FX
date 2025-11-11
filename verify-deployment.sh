#!/bin/bash
# Verify deployment readiness for Render

echo "=== VolatiSense Deployment Verification ==="
echo ""

# Check Python version
echo "1. Checking Python version..."
python3 --version

# Check if all required files exist
echo ""
echo "2. Verifying required files..."
files=("runtime.txt" "backend/runtime.txt" "backend/requirements.txt" "backend/main.py" "render.yaml")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
    fi
done

# Verify runtime.txt content
echo ""
echo "3. Checking runtime.txt..."
if grep -q "python-3.11" runtime.txt; then
    echo "✓ Python 3.11 specified in runtime.txt"
else
    echo "✗ Python version not correctly set"
fi

# Test import of main dependencies
echo ""
echo "4. Testing backend dependencies..."
cd backend
python3 -c "
import sys
print(f'Python version: {sys.version}')

try:
    import fastapi
    print('✓ FastAPI imported successfully')
except ImportError as e:
    print(f'✗ FastAPI import failed: {e}')

try:
    import numpy
    print(f'✓ NumPy {numpy.__version__} imported successfully')
except ImportError as e:
    print(f'✗ NumPy import failed: {e}')

try:
    import pandas
    print(f'✓ Pandas {pandas.__version__} imported successfully')
except ImportError as e:
    print(f'✗ Pandas import failed: {e}')

try:
    import scipy
    print('✓ SciPy imported successfully')
except ImportError as e:
    print(f'✗ SciPy import failed: {e}')
"

# Run a quick syntax check on all Python files
echo ""
echo "5. Syntax checking Python files..."
python3 -m py_compile *.py 2>/dev/null && echo "✓ All Python files have valid syntax" || echo "✗ Syntax errors found"

cd ..

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Go to Render dashboard: https://dashboard.render.com"
echo "2. Select your service: volatisense-api"
echo "3. Click 'Manual Deploy' -> 'Deploy latest commit'"
echo "4. Monitor build logs for successful deployment"
