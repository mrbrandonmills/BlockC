#!/usr/bin/env node

/**
 * Test script for Vellum export functionality
 * Run with: node test-export.js
 */

const fs = require('fs');
const path = require('path');

async function testExport() {
  console.log('🧪 Testing Vellum Export System...\n');

  const testData = {
    content: `= Chapter 1: The Beginning

It was a bright cold day in April, and the clocks were striking thirteen.

Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions.

= Chapter 2: The Discovery

The telescreen received and transmitted simultaneously. Any sound that Winston made, above the level of a very low whisper, would be picked up by it.`,
    title: 'Block C: The Laboratory of Living',
    authors: ['Brandon Mills', 'Claude'],
    style: 'luxury-lab',
    contentType: 'html',
  };

  try {
    console.log('📄 Test Data:');
    console.log('  Title:', testData.title);
    console.log('  Authors:', testData.authors.join(', '));
    console.log('  Style:', testData.style);
    console.log('');

    console.log('🔍 Checking prerequisites...');

    // Check if Typst is installed
    const { execSync } = require('child_process');
    try {
      const typstVersion = execSync('typst --version', { encoding: 'utf8' });
      console.log('  ✅ Typst installed:', typstVersion.trim());
    } catch (error) {
      console.log('  ❌ Typst not installed');
      return;
    }

    // Check if Pandoc is installed
    try {
      const pandocVersion = execSync('pandoc --version', { encoding: 'utf8' }).split('\n')[0];
      console.log('  ✅ Pandoc installed:', pandocVersion.trim());
    } catch (error) {
      console.log('  ⚠️  Pandoc not installed (EPUB exports will fail)');
    }

    // Check if style templates exist
    const stylesDir = path.join(__dirname, 'styles');
    const styleFile = path.join(stylesDir, `${testData.style}.typ`);

    if (fs.existsSync(styleFile)) {
      console.log('  ✅ Style template found:', testData.style);
      const templateSize = fs.statSync(styleFile).size;
      console.log('     Template size:', templateSize, 'bytes');
    } else {
      console.log('  ❌ Style template not found:', styleFile);
      return;
    }

    console.log('');
    console.log('📦 Making export request to http://localhost:3000/api/export/pdf...');

    const response = await fetch('http://localhost:3000/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const outputPath = path.join(__dirname, 'test-output.pdf');
      fs.writeFileSync(outputPath, buffer);

      console.log('  ✅ Export successful!');
      console.log('  📄 PDF saved to:', outputPath);
      console.log('  📊 File size:', buffer.length, 'bytes');

      // Verify it's a valid PDF
      const pdfHeader = buffer.toString('utf8', 0, 5);
      if (pdfHeader === '%PDF-') {
        console.log('  ✅ Valid PDF file generated');
      } else {
        console.log('  ⚠️  File may not be a valid PDF');
      }
    } else {
      const error = await response.json();
      console.log('  ❌ Export failed');
      console.log('  Error:', error);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.cause) {
      console.log('   Cause:', error.cause);
    }
  }
}

// Run the test
testExport().then(() => {
  console.log('\n✨ Test complete\n');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
