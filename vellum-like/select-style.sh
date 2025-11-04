#!/bin/bash
# STYLE SELECTOR - Choose your book style like Vellum

echo "📚 Vellum-Like Book Formatter"
echo "=============================="
echo ""
echo "Available Styles:"
echo ""
echo "1) Luxury Laboratory - Modern scientific aesthetic with geometric designs"
echo "   Colors: Cream, Deep Slate, Bright Cyan"
echo "   Best for: Non-fiction, self-help, technical books"
echo ""
echo "2) Serif Classic - Traditional book layout with drop caps and ornaments"
echo "   Colors: Warm White, Gold, Brown"
echo "   Best for: Fiction, historical, literary"
echo ""
echo "3) Modern Sans - Clean contemporary design"
echo "   Colors: White, Blue, Teal"
echo "   Best for: Business, productivity, modern non-fiction"
echo ""
echo -n "Select style (1-3): "
read choice

case $choice in
  1)
    STYLE="luxury-lab"
    echo "✅ Selected: Luxury Laboratory"
    ;;
  2)
    STYLE="serif-classic"
    echo "✅ Selected: Serif Classic"
    ;;
  3)
    STYLE="modern-sans"
    echo "✅ Selected: Modern Sans"
    ;;
  *)
    echo "❌ Invalid choice. Using default (Luxury Laboratory)"
    STYLE="luxury-lab"
    ;;
esac

echo ""
echo "Building your book with $STYLE style..."
echo ""

# Update build script with selected style
sed -i.bak "s/STYLE=\".*\"/STYLE=\"$STYLE\"/" build-book.sh

# Run build
./build-book.sh

echo ""
echo "🎨 Style: $STYLE"
echo "📂 Output: output/block-c-print.pdf"
echo ""
echo "💡 To try a different style, run ./select-style.sh again!"
