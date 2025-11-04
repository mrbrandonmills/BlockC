#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testEpubExport() {
  console.log('📚 Testing EPUB Export...\n');

  const testData = {
    content: `<h1>Chapter 1: The Beginning</h1>

<p>It was a bright cold day in April, and the clocks were striking thirteen.</p>

<p>Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions.</p>

<h1>Chapter 2: The Discovery</h1>

<p>The telescreen received and transmitted simultaneously. Any sound that Winston made, above the level of a very low whisper, would be picked up by it.</p>`,
    title: 'Block C: The Laboratory of Living',
    authors: ['Brandon Mills', 'Claude'],
    contentType: 'html',
  };

  try {
    console.log('📦 Making export request to http://localhost:3000/api/export/epub...');

    const response = await fetch('http://localhost:3000/api/export/epub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const outputPath = path.join(__dirname, 'test-output.epub');
      fs.writeFileSync(outputPath, buffer);

      console.log('  ✅ EPUB export successful!');
      console.log('  📄 EPUB saved to:', outputPath);
      console.log('  📊 File size:', buffer.length, 'bytes');

      // Verify it's a valid EPUB (ZIP file starting with PK)
      const zipHeader = buffer.toString('hex', 0, 2);
      if (zipHeader === '504b') {
        console.log('  ✅ Valid EPUB file generated (ZIP signature found)');
      } else {
        console.log('  ⚠️  File may not be a valid EPUB');
      }
    } else {
      const error = await response.json();
      console.log('  ❌ EPUB export failed');
      console.log('  Error:', error);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEpubExport().then(() => {
  console.log('\n✨ Test complete\n');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
