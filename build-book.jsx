// BLOCK C: THE LABORATORY OF LIVING
// InDesign ExtendScript (JavaScript)
// Automated luxury book creation

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
    // Document settings
    documentWidth: "6in",
    documentHeight: "9in",
    facingPages: true,

    // Margins
    marginTop: "0.85in",
    marginBottom: "0.85in",
    marginInside: "0.85in",
    marginOutside: "0.7in",

    // Colors (RGB for screen, will convert to CMYK for print)
    colors: {
        creamBg: [232, 228, 220],      // #E8E4DC
        richBlack: [26, 26, 26],         // #1A1A1A
        deepSlate: [47, 79, 79],         // #2F4F4F
        brightCyan: [0, 206, 209],       // #00CED1
        warmAmber: [255, 179, 71],       // #FFB347
        softGray: [139, 139, 139]        // #8B8B8B
    },

    // Typography
    fonts: {
        body: "Georgia",
        heading: "Georgia"
    },

    bodySizePt: 11.5,
    leadingPt: 13.5,

    // File paths
    manuscriptFile: "BLOCK_C_COMPLETE_MANUSCRIPT.md",
    outputPDF: "BLOCK_C_LUXURY_INDESIGN.pdf"
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {

    try {
        // Create new document
        var doc = createDocument();

        // Set up colors
        setupColors(doc);

        // Create paragraph and character styles
        setupStyles(doc);

        // Create master pages (headers/footers/page numbers)
        setupMasterPages(doc);

        // Create title page
        createTitlePage(doc);

        // Create copyright page
        createCopyrightPage(doc);

        // Create table of contents
        createTableOfContents(doc);

        // Import and format manuscript
        importManuscript(doc);

        // Alert completion
        alert("Book created successfully!\n\nPages: " + doc.pages.length + "\n\nReady to export PDF.");

        return doc;

    } catch (e) {
        alert("ERROR: " + e.message + "\n\nLine: " + e.line);
        return null;
    }
}

// ============================================================================
// DOCUMENT CREATION
// ============================================================================

function createDocument() {

    var doc = app.documents.add();

    // Set document properties
    doc.documentPreferences.pageWidth = CONFIG.documentWidth;
    doc.documentPreferences.pageHeight = CONFIG.documentHeight;
    doc.documentPreferences.facingPages = CONFIG.facingPages;
    doc.documentPreferences.pageOrientation = PageOrientation.PORTRAIT;

    // Set margins
    var margins = doc.marginPreferences;
    margins.top = CONFIG.marginTop;
    margins.bottom = CONFIG.marginBottom;
    margins.left = CONFIG.marginInside;
    margins.right = CONFIG.marginOutside;

    // Set color settings for print
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.INCHES;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.INCHES;

    return doc;
}

// ============================================================================
// COLOR SETUP
// ============================================================================

function setupColors(doc) {

    var colors = CONFIG.colors;

    // Create color swatches
    createColorSwatch(doc, "Cream Background", colors.creamBg);
    createColorSwatch(doc, "Rich Black", colors.richBlack);
    createColorSwatch(doc, "Deep Slate", colors.deepSlate);
    createColorSwatch(doc, "Bright Cyan", colors.brightCyan);
    createColorSwatch(doc, "Warm Amber", colors.warmAmber);
    createColorSwatch(doc, "Soft Gray", colors.softGray);
}

function createColorSwatch(doc, name, rgb) {

    try {
        var color = doc.colors.item(name);
        if (!color.isValid) {
            color = doc.colors.add();
            color.name = name;
            color.model = ColorModel.PROCESS;
            color.space = ColorSpace.RGB;
            color.colorValue = rgb;
        }
    } catch (e) {
        // Color might already exist
    }
}

// ============================================================================
// STYLES SETUP
// ============================================================================

function setupStyles(doc) {

    // Body text style
    var bodyStyle = doc.paragraphStyles.add();
    bodyStyle.name = "Body Text";
    bodyStyle.appliedFont = CONFIG.fonts.body;
    bodyStyle.pointSize = CONFIG.bodySizePt;
    bodyStyle.leading = CONFIG.leadingPt;
    bodyStyle.justification = Justification.LEFT_ALIGN;
    bodyStyle.firstLineIndent = "0.15in";
    bodyStyle.fillColor = doc.colors.item("Rich Black");

    // Chapter heading style
    var chapterStyle = doc.paragraphStyles.add();
    chapterStyle.name = "Chapter Heading";
    chapterStyle.appliedFont = CONFIG.fonts.heading;
    chapterStyle.fontStyle = "Bold";
    chapterStyle.pointSize = 26;
    chapterStyle.justification = Justification.CENTER_ALIGN;
    chapterStyle.spaceBefore = "1.5in";
    chapterStyle.spaceAfter = "0.6in";
    chapterStyle.fillColor = doc.colors.item("Rich Black");
    chapterStyle.capitalization = Capitalization.ALL_CAPS;

    // Section heading style
    var sectionStyle = doc.paragraphStyles.add();
    sectionStyle.name = "Section Heading";
    sectionStyle.appliedFont = CONFIG.fonts.heading;
    sectionStyle.fontStyle = "Bold";
    sectionStyle.pointSize = 18;
    sectionStyle.justification = Justification.LEFT_ALIGN;
    sectionStyle.spaceBefore = "0.4in";
    sectionStyle.spaceAfter = "0.25in";
    sectionStyle.fillColor = doc.colors.item("Deep Slate");

    // Subheading style
    var subheadStyle = doc.paragraphStyles.add();
    subheadStyle.name = "Subheading";
    subheadStyle.appliedFont = CONFIG.fonts.heading;
    subheadStyle.fontStyle = "Bold";
    subheadStyle.pointSize = 14;
    subheadStyle.justification = Justification.LEFT_ALIGN;
    subheadStyle.spaceBefore = "0.3in";
    subheadStyle.spaceAfter = "0.15in";
    subheadStyle.fillColor = doc.colors.item("Rich Black");

    // Pull quote style
    var pullQuoteStyle = doc.paragraphStyles.add();
    pullQuoteStyle.name = "Pull Quote";
    pullQuoteStyle.appliedFont = CONFIG.fonts.body;
    pullQuoteStyle.fontStyle = "Italic";
    pullQuoteStyle.pointSize = 13;
    pullQuoteStyle.leading = 16;
    pullQuoteStyle.justification = Justification.LEFT_ALIGN;
    pullQuoteStyle.leftIndent = "0.5in";
    pullQuoteStyle.rightIndent = "0.5in";
    pullQuoteStyle.spaceBefore = "0.3in";
    pullQuoteStyle.spaceAfter = "0.3in";
    pullQuoteStyle.fillColor = doc.colors.item("Deep Slate");
}

// ============================================================================
// MASTER PAGES SETUP
// ============================================================================

function setupMasterPages(doc) {

    var masterSpread = doc.masterSpreads[0];

    // Left page (even pages)
    var leftPage = masterSpread.pages[0];

    // Right page (odd pages)
    var rightPage = masterSpread.pages[1];

    // Add page numbers to both pages
    addPageNumber(leftPage, "left");
    addPageNumber(rightPage, "right");

    // Add headers
    addHeader(leftPage, "left");
    addHeader(rightPage, "right");
}

function addPageNumber(page, side) {

    var doc = app.activeDocument;
    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];
    var pageHeight = bounds[2] - bounds[0];

    // Create text frame for page number at bottom
    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [
        pageHeight - 0.6, // top
        0.85,              // left
        pageHeight - 0.4, // bottom
        pageWidth - 0.7   // right
    ];

    textFrame.contents = SpecialCharacters.AUTO_PAGE_NUMBER;
    textFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    textFrame.parentStory.paragraphs[0].pointSize = 10;
    textFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");
}

function addHeader(page, side) {

    var doc = app.activeDocument;
    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Create text frame for header
    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [
        0.5,               // top
        0.85,              // left
        0.7,               // bottom
        pageWidth - 0.7    // right
    ];

    textFrame.contents = "BLOCK C  •  THE LABORATORY OF LIVING";
    textFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    textFrame.parentStory.paragraphs[0].pointSize = 8.5;
    textFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Soft Gray");

    // Add line below header
    var line = page.graphicLines.add();
    line.strokeWeight = 0.3;
    line.strokeColor = doc.colors.item("Soft Gray");
    line.paths[0].entirePath = [
        [0.85, 0.75],
        [pageWidth - 0.7, 0.75]
    ];
}

// ============================================================================
// TITLE PAGE
// ============================================================================

function createTitlePage(doc) {

    var page = doc.pages.add(LocationOptions.AT_END);
    page.appliedMaster = null; // No master page for title

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];
    var pageHeight = bounds[2] - bounds[0];

    // Background color
    var bgRect = page.rectangles.add();
    bgRect.geometricBounds = bounds;
    bgRect.fillColor = doc.colors.item("Cream Background");
    bgRect.strokeWeight = 0;

    // Series name
    var seriesFrame = page.textFrames.add();
    seriesFrame.geometricBounds = [2, 1, 2.3, pageWidth - 1];
    seriesFrame.contents = "RANDOM ACTS OF SELF-ACTUALIZATION";
    seriesFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    seriesFrame.parentStory.paragraphs[0].pointSize = 12;
    seriesFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    seriesFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Soft Gray");
    seriesFrame.parentStory.paragraphs[0].capitalization = Capitalization.SMALL_CAPS;

    // Main title - BLOCK C
    var titleFrame = page.textFrames.add();
    titleFrame.geometricBounds = [2.8, 1, 3.5, pageWidth - 1];
    titleFrame.contents = "BLOCK C";
    titleFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    titleFrame.parentStory.paragraphs[0].fontStyle = "Bold";
    titleFrame.parentStory.paragraphs[0].pointSize = 42;
    titleFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    titleFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");

    // Subtitle
    var subtitleFrame = page.textFrames.add();
    subtitleFrame.geometricBounds = [3.8, 1, 4.3, pageWidth - 1];
    subtitleFrame.contents = "The Laboratory of Living";
    subtitleFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    subtitleFrame.parentStory.paragraphs[0].fontStyle = "Italic";
    subtitleFrame.parentStory.paragraphs[0].pointSize = 22;
    subtitleFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    subtitleFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Deep Slate");

    // Authors
    var authorsFrame = page.textFrames.add();
    authorsFrame.geometricBounds = [5.2, 1, 5.6, pageWidth - 1];
    authorsFrame.contents = "Brandon Mills & Jesse Doherty";
    authorsFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    authorsFrame.parentStory.paragraphs[0].fontStyle = "Bold";
    authorsFrame.parentStory.paragraphs[0].pointSize = 16;
    authorsFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    authorsFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");
}

// ============================================================================
// COPYRIGHT PAGE
// ============================================================================

function createCopyrightPage(doc) {

    var page = doc.pages.add(LocationOptions.AT_END);
    page.appliedMaster = null;

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Background
    var bgRect = page.rectangles.add();
    bgRect.geometricBounds = bounds;
    bgRect.fillColor = doc.colors.item("Cream Background");
    bgRect.strokeWeight = 0;

    // Copyright text
    var copyrightText = "Copyright © 2025 Brandon Mills & Jesse Doherty\n";
    copyrightText += "All rights reserved.\n\n";
    copyrightText += "No part of this book may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the authors, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.\n\n";
    copyrightText += "Published by Self-Actualize Life\n";
    copyrightText += "www.selfactualize.life\n";
    copyrightText += "www.brandonmills.com\n\n";
    copyrightText += "First Edition: 2025\n";
    copyrightText += "ISBN: [To be assigned]";

    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [3.5, 1, 7, pageWidth - 1];
    textFrame.contents = copyrightText;
    textFrame.parentStory.paragraphs.everyItem().appliedFont = "Georgia";
    textFrame.parentStory.paragraphs.everyItem().pointSize = 9;
    textFrame.parentStory.paragraphs.everyItem().justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs.everyItem().fillColor = doc.colors.item("Rich Black");
}

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================

function createTableOfContents(doc) {

    var page = doc.pages.add(LocationOptions.AT_END);

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Background
    var bgRect = page.rectangles.add();
    bgRect.geometricBounds = bounds;
    bgRect.fillColor = doc.colors.item("Cream Background");
    bgRect.strokeWeight = 0;

    // TOC title
    var titleFrame = page.textFrames.add();
    titleFrame.geometricBounds = [1.5, 1, 2, pageWidth - 1];
    titleFrame.contents = "TABLE OF CONTENTS";
    titleFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    titleFrame.parentStory.paragraphs[0].fontStyle = "Bold";
    titleFrame.parentStory.paragraphs[0].pointSize = 24;
    titleFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    titleFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");

    // TOC entries
    var tocText = "Introduction: The Laboratory of Living . . . . . . . . . . . . . . . . 5\n\n";
    tocText += "Chapter I: Moments of Permission . . . . . . . . . . . . . . . . . . 16\n\n";
    tocText += "Chapter II: Technology as Mirror . . . . . . . . . . . . . . . . . . . 36\n\n";
    tocText += "Chapter III: The Awakening Crisis . . . . . . . . . . . . . . . . . . 61\n\n";
    tocText += "Chapter IV: Conscious Transformation . . . . . . . . . . . . . . 86\n\n";
    tocText += "Chapter V: Bridging the Gaps . . . . . . . . . . . . . . . . . . . . . . 126\n\n";
    tocText += "Chapter VI: The Integration . . . . . . . . . . . . . . . . . . . . . . . 161\n\n";
    tocText += "Conclusion: The Invitation Forward . . . . . . . . . . . . . . . . . 196";

    var tocFrame = page.textFrames.add();
    tocFrame.geometricBounds = [2.5, 1.2, 7, pageWidth - 1.2];
    tocFrame.contents = tocText;
    tocFrame.parentStory.paragraphs.everyItem().appliedFont = "Georgia";
    tocFrame.parentStory.paragraphs.everyItem().pointSize = 11;
    tocFrame.parentStory.paragraphs.everyItem().justification = Justification.LEFT_ALIGN;
    tocFrame.parentStory.paragraphs.everyItem().fillColor = doc.colors.item("Rich Black");
}

// ============================================================================
// MANUSCRIPT IMPORT
// ============================================================================

function importManuscript(doc) {

    var manuscriptFile = new File(Folder(doc.filePath) + "/" + CONFIG.manuscriptFile);

    if (!manuscriptFile.exists) {
        alert("Manuscript file not found: " + CONFIG.manuscriptFile + "\n\nPlease place the manuscript in the same folder as the InDesign document.");
        return;
    }

    // Read manuscript
    manuscriptFile.open('r');
    var content = manuscriptFile.read();
    manuscriptFile.close();

    // Create new page for content start
    var page = doc.pages.add(LocationOptions.AT_END);

    // Background
    var bgRect = page.rectangles.add();
    bgRect.geometricBounds = page.bounds;
    bgRect.fillColor = doc.colors.item("Cream Background");
    bgRect.strokeWeight = 0;

    // Create main text frame
    var textFrame = page.textFrames.add();
    var margins = doc.marginPreferences;
    textFrame.geometricBounds = [
        margins.top,
        margins.left,
        page.bounds[2] - margins.bottom,
        page.bounds[3] - margins.right
    ];

    // Set text frame to auto-flow
    textFrame.contents = content;
    textFrame.parentStory.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.item("Body Text");

    // Auto-flow to new pages
    while (textFrame.overflows) {
        var newPage = doc.pages.add(LocationOptions.AT_END);

        // Background for new page
        var newBgRect = newPage.rectangles.add();
        newBgRect.geometricBounds = newPage.bounds;
        newBgRect.fillColor = doc.colors.item("Cream Background");
        newBgRect.strokeWeight = 0;
        newBgRect.sendToBack();

        // Create linked text frame
        var newTextFrame = newPage.textFrames.add();
        newTextFrame.geometricBounds = [
            margins.top,
            margins.left,
            newPage.bounds[2] - margins.bottom,
            newPage.bounds[3] - margins.right
        ];

        textFrame.nextTextFrame = newTextFrame;
        textFrame = newTextFrame;
    }

    alert("Manuscript imported successfully!\n\nNow applying styles...");

    // Apply heading styles based on markdown syntax
    applyMarkdownStyles(doc);
}

// ============================================================================
// MARKDOWN STYLE APPLICATION
// ============================================================================

function applyMarkdownStyles(doc) {

    // Find all stories in document
    for (var i = 0; i < doc.stories.length; i++) {
        var story = doc.stories[i];

        // Find and style chapter headings (== )
        app.findGrepPreferences = NothingEnum.NOTHING;
        app.changeGrepPreferences = NothingEnum.NOTHING;
        app.findGrepPreferences.findWhat = "^== .+$";
        app.changeGrepPreferences.appliedParagraphStyle = doc.paragraphStyles.item("Chapter Heading");

        story.changeGrep();

        // Find and style section headings (=== )
        app.findGrepPreferences = NothingEnum.NOTHING;
        app.changeGrepPreferences = NothingEnum.NOTHING;
        app.findGrepPreferences.findWhat = "^=== .+$";
        app.changeGrepPreferences.appliedParagraphStyle = doc.paragraphStyles.item("Section Heading");

        story.changeGrep();

        // Remove markdown syntax
        app.findGrepPreferences = NothingEnum.NOTHING;
        app.changeGrepPreferences = NothingEnum.NOTHING;
        app.findGrepPreferences.findWhat = "^=+\\s+";
        app.changeGrepPreferences.changeTo = "";

        story.changeGrep();
    }

    // Reset preferences
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
}

// ============================================================================
// RUN THE SCRIPT
// ============================================================================

main();
