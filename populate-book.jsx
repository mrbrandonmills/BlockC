// BLOCK C: THE LABORATORY OF LIVING
// InDesign ExtendScript - Populate Luxury Book
// This script opens your InDesign document and builds the complete book

#target indesign

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
    indesignFile: "/Users/brandon/BlockC/BLOCK C.indd",
    manuscriptFile: "/Users/brandon/BlockC/BLOCK_C_COMPLETE_MANUSCRIPT.md",

    // Colors (RGB values)
    colors: {
        creamBg: [232, 228, 220],
        richBlack: [26, 26, 26],
        deepSlate: [47, 79, 79],
        brightCyan: [0, 206, 209],
        warmAmber: [255, 179, 71],
        softGray: [139, 139, 139]
    }
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {

    try {
        // Open the document
        var docFile = new File(CONFIG.indesignFile);
        if (!docFile.exists) {
            alert("ERROR: Cannot find InDesign file at:\n" + CONFIG.indesignFile);
            return;
        }

        var doc = app.open(docFile);

        alert("Document opened successfully!\nPages: " + doc.pages.length + "\n\nNow setting up colors and styles...");

        // Set up colors
        setupColors(doc);

        // Create paragraph and character styles
        setupStyles(doc);

        // Set up master pages
        setupMasterPages(doc);

        // Apply cream background to all pages
        applyBackgroundToAllPages(doc);

        // Create front matter on first pages
        createFrontMatter(doc);

        // Import manuscript starting at page 5
        importManuscript(doc);

        alert("SUCCESS!\n\nBook populated with:\n- Colors & styles\n- Master pages\n- Front matter\n- Complete manuscript\n\nPages: " + doc.pages.length + "\n\nNow review and we'll add artwork next.");

    } catch (e) {
        alert("ERROR: " + e.message + "\n\nLine: " + e.line + "\n\nFile: " + e.fileName);
    }
}

// ============================================================================
// COLOR SETUP
// ============================================================================

function setupColors(doc) {

    var colors = CONFIG.colors;

    createColor(doc, "Cream Background", colors.creamBg);
    createColor(doc, "Rich Black", colors.richBlack);
    createColor(doc, "Deep Slate", colors.deepSlate);
    createColor(doc, "Bright Cyan", colors.brightCyan);
    createColor(doc, "Warm Amber", colors.warmAmber);
    createColor(doc, "Soft Gray", colors.softGray);
}

function createColor(doc, name, rgbValues) {

    try {
        var existing = doc.colors.item(name);
        if (existing.isValid) return;
    } catch (e) {}

    var color = doc.colors.add();
    color.name = name;
    color.model = ColorModel.PROCESS;
    color.space = ColorSpace.RGB;
    color.colorValue = rgbValues;
}

// ============================================================================
// STYLES SETUP
// ============================================================================

function setupStyles(doc) {

    // Body Text
    var bodyStyle = createOrGetParaStyle(doc, "Body Text");
    bodyStyle.appliedFont = "Georgia";
    bodyStyle.pointSize = 11.5;
    bodyStyle.leading = 13.5;
    bodyStyle.justification = Justification.LEFT_ALIGN;
    bodyStyle.firstLineIndent = "0.18in";
    bodyStyle.spaceBefore = 0;
    bodyStyle.spaceAfter = 0;
    bodyStyle.fillColor = doc.colors.item("Rich Black");

    // Body First Paragraph (no indent)
    var bodyFirstStyle = createOrGetParaStyle(doc, "Body First");
    bodyFirstStyle.basedOn = bodyStyle;
    bodyFirstStyle.firstLineIndent = 0;
    bodyFirstStyle.spaceBefore = "0.15in";

    // Chapter Heading (== in markdown)
    var chapterStyle = createOrGetParaStyle(doc, "Chapter Heading");
    chapterStyle.appliedFont = "Georgia";
    chapterStyle.fontStyle = "Bold";
    chapterStyle.pointSize = 26;
    chapterStyle.leading = 32;
    chapterStyle.justification = Justification.CENTER_ALIGN;
    chapterStyle.spaceBefore = "1.5in";
    chapterStyle.spaceAfter = "0.6in";
    chapterStyle.fillColor = doc.colors.item("Rich Black");
    chapterStyle.capitalization = Capitalization.ALL_CAPS;

    // Section Heading (=== in markdown)
    var sectionStyle = createOrGetParaStyle(doc, "Section Heading");
    sectionStyle.appliedFont = "Georgia";
    sectionStyle.fontStyle = "Bold";
    sectionStyle.pointSize = 18;
    sectionStyle.leading = 22;
    sectionStyle.justification = Justification.LEFT_ALIGN;
    sectionStyle.spaceBefore = "0.4in";
    sectionStyle.spaceAfter = "0.2in";
    sectionStyle.fillColor = doc.colors.item("Deep Slate");

    // Pull Quote
    var pullQuoteStyle = createOrGetParaStyle(doc, "Pull Quote");
    pullQuoteStyle.appliedFont = "Georgia";
    pullQuoteStyle.fontStyle = "Italic";
    pullQuoteStyle.pointSize = 13;
    pullQuoteStyle.leading = 16;
    pullQuoteStyle.justification = Justification.LEFT_ALIGN;
    pullQuoteStyle.leftIndent = "0.5in";
    pullQuoteStyle.rightIndent = "0.5in";
    pullQuoteStyle.spaceBefore = "0.25in";
    pullQuoteStyle.spaceAfter = "0.25in";
    pullQuoteStyle.fillColor = doc.colors.item("Deep Slate");
}

function createOrGetParaStyle(doc, name) {
    try {
        var style = doc.paragraphStyles.item(name);
        if (style.isValid) return style;
    } catch (e) {}

    return doc.paragraphStyles.add({name: name});
}

// ============================================================================
// MASTER PAGES SETUP
// ============================================================================

function setupMasterPages(doc) {

    var master = doc.masterSpreads[0];

    // Get pages
    var leftPage = master.pages[0];
    var rightPage = master.pages[1];

    // Add page numbers
    addPageNumber(doc, leftPage, "left");
    addPageNumber(doc, rightPage, "right");

    // Add headers
    addHeader(doc, leftPage);
    addHeader(doc, rightPage);
}

function addPageNumber(doc, page, side) {

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];
    var pageHeight = bounds[2] - bounds[0];

    // Page number at bottom center
    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [
        pageHeight - 0.6,
        0.85,
        pageHeight - 0.4,
        pageWidth - 0.85
    ];

    textFrame.contents = SpecialCharacters.AUTO_PAGE_NUMBER;
    textFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    textFrame.parentStory.paragraphs[0].pointSize = 10;
    textFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");
}

function addHeader(doc, page) {

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Header text
    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [
        0.5,
        0.85,
        0.68,
        pageWidth - 0.85
    ];

    textFrame.contents = "BLOCK C  •  THE LABORATORY OF LIVING";
    textFrame.parentStory.paragraphs[0].appliedFont = "Georgia";
    textFrame.parentStory.paragraphs[0].fontStyle = "Italic";
    textFrame.parentStory.paragraphs[0].pointSize = 8.5;
    textFrame.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs[0].fillColor = doc.colors.item("Soft Gray");

    // Line below header
    var line = page.graphicLines.add();
    line.strokeWeight = 0.3;
    line.strokeColor = doc.colors.item("Soft Gray");
    line.paths[0].entirePath = [
        [0.85, 0.72],
        [pageWidth - 0.85, 0.72]
    ];
}

// ============================================================================
// APPLY BACKGROUND TO ALL PAGES
// ============================================================================

function applyBackgroundToAllPages(doc) {

    for (var i = 0; i < doc.pages.length; i++) {
        var page = doc.pages[i];

        // Check if background already exists
        var hasBackground = false;
        for (var j = 0; j < page.rectangles.length; j++) {
            if (page.rectangles[j].label == "background") {
                hasBackground = true;
                break;
            }
        }

        if (!hasBackground) {
            var bg = page.rectangles.add();
            bg.geometricBounds = page.bounds;
            bg.fillColor = doc.colors.item("Cream Background");
            bg.strokeWeight = 0;
            bg.label = "background";
            bg.sendToBack();
        }
    }
}

// ============================================================================
// FRONT MATTER
// ============================================================================

function createFrontMatter(doc) {

    // Remove master from first 4 pages
    for (var i = 0; i < Math.min(4, doc.pages.length); i++) {
        doc.pages[i].appliedMaster = null;
    }

    // Page 1: Title Page
    createTitlePage(doc, doc.pages[0]);

    // Page 2: Copyright
    if (doc.pages.length > 1) {
        createCopyrightPage(doc, doc.pages[1]);
    }

    // Page 3: Table of Contents
    if (doc.pages.length > 2) {
        createTOC(doc, doc.pages[2]);
    }
}

function createTitlePage(doc, page) {

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Series name
    var series = page.textFrames.add();
    series.geometricBounds = [2, 1, 2.3, pageWidth - 1];
    series.contents = "RANDOM ACTS OF SELF-ACTUALIZATION";
    series.parentStory.paragraphs[0].appliedFont = "Georgia";
    series.parentStory.paragraphs[0].pointSize = 11;
    series.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    series.parentStory.paragraphs[0].fillColor = doc.colors.item("Soft Gray");
    series.parentStory.paragraphs[0].capitalization = Capitalization.SMALL_CAPS;

    // Main title
    var title = page.textFrames.add();
    title.geometricBounds = [2.7, 1, 3.4, pageWidth - 1];
    title.contents = "BLOCK C";
    title.parentStory.paragraphs[0].appliedFont = "Georgia";
    title.parentStory.paragraphs[0].fontStyle = "Bold";
    title.parentStory.paragraphs[0].pointSize = 42;
    title.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    title.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");

    // Subtitle
    var subtitle = page.textFrames.add();
    subtitle.geometricBounds = [3.7, 1, 4.2, pageWidth - 1];
    subtitle.contents = "The Laboratory of Living";
    subtitle.parentStory.paragraphs[0].appliedFont = "Georgia";
    subtitle.parentStory.paragraphs[0].fontStyle = "Italic";
    subtitle.parentStory.paragraphs[0].pointSize = 22;
    subtitle.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    subtitle.parentStory.paragraphs[0].fillColor = doc.colors.item("Deep Slate");

    // Authors
    var authors = page.textFrames.add();
    authors.geometricBounds = [5, 1, 5.4, pageWidth - 1];
    authors.contents = "Brandon Mills & Jesse Doherty";
    authors.parentStory.paragraphs[0].appliedFont = "Georgia";
    authors.parentStory.paragraphs[0].fontStyle = "Bold";
    authors.parentStory.paragraphs[0].pointSize = 16;
    authors.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    authors.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");
}

function createCopyrightPage(doc, page) {

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    var copyrightText = "Copyright © 2025 Brandon Mills & Jesse Doherty\nAll rights reserved.\n\n";
    copyrightText += "No part of this book may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the authors, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.\n\n";
    copyrightText += "Published by Self-Actualize Life\nwww.selfactualize.life\nwww.brandonmills.com\n\n";
    copyrightText += "First Edition: 2025\nISBN: [To be assigned]";

    var textFrame = page.textFrames.add();
    textFrame.geometricBounds = [3.5, 1, 7, pageWidth - 1];
    textFrame.contents = copyrightText;
    textFrame.parentStory.paragraphs.everyItem().appliedFont = "Georgia";
    textFrame.parentStory.paragraphs.everyItem().pointSize = 9;
    textFrame.parentStory.paragraphs.everyItem().justification = Justification.CENTER_ALIGN;
    textFrame.parentStory.paragraphs.everyItem().fillColor = doc.colors.item("Rich Black");
}

function createTOC(doc, page) {

    var bounds = page.bounds;
    var pageWidth = bounds[3] - bounds[1];

    // Title
    var title = page.textFrames.add();
    title.geometricBounds = [1.5, 1, 2, pageWidth - 1];
    title.contents = "TABLE OF CONTENTS";
    title.parentStory.paragraphs[0].appliedFont = "Georgia";
    title.parentStory.paragraphs[0].fontStyle = "Bold";
    title.parentStory.paragraphs[0].pointSize = 22;
    title.parentStory.paragraphs[0].justification = Justification.CENTER_ALIGN;
    title.parentStory.paragraphs[0].fillColor = doc.colors.item("Rich Black");

    // Entries
    var tocText = "Introduction: The Laboratory of Living . . . . . . . . . . . . . . . . 5\n\n";
    tocText += "Chapter I: Moments of Permission . . . . . . . . . . . . . . . . . . 16\n\n";
    tocText += "Chapter II: Technology as Mirror . . . . . . . . . . . . . . . . . . . 36\n\n";
    tocText += "Chapter III: The Awakening Crisis . . . . . . . . . . . . . . . . . . 61\n\n";
    tocText += "Chapter IV: Conscious Transformation . . . . . . . . . . . . . . 86\n\n";
    tocText += "Chapter V: Bridging the Gaps . . . . . . . . . . . . . . . . . . . . . . 126\n\n";
    tocText += "Chapter VI: The Integration . . . . . . . . . . . . . . . . . . . . . . . 161\n\n";
    tocText += "Conclusion: The Invitation Forward . . . . . . . . . . . . . . . . . 196";

    var toc = page.textFrames.add();
    toc.geometricBounds = [2.5, 1.2, 7, pageWidth - 1.2];
    toc.contents = tocText;
    toc.parentStory.paragraphs.everyItem().appliedFont = "Georgia";
    toc.parentStory.paragraphs.everyItem().pointSize = 11;
    toc.parentStory.paragraphs.everyItem().justification = Justification.LEFT_ALIGN;
    toc.parentStory.paragraphs.everyItem().fillColor = doc.colors.item("Rich Black");
}

// ============================================================================
// MANUSCRIPT IMPORT
// ============================================================================

function importManuscript(doc) {

    var manuscriptFile = new File(CONFIG.manuscriptFile);

    if (!manuscriptFile.exists) {
        alert("ERROR: Manuscript file not found:\n" + CONFIG.manuscriptFile);
        return;
    }

    // Read manuscript
    manuscriptFile.open('r');
    manuscriptFile.encoding = "UTF-8";
    var content = manuscriptFile.read();
    manuscriptFile.close();

    // Start at page 5 (index 4)
    var startPageIndex = Math.min(4, doc.pages.length - 1);
    var page = doc.pages[startPageIndex];

    // Create text frame
    var textFrame = page.textFrames.add();
    var bounds = page.bounds;
    textFrame.geometricBounds = [
        0.85,  // top margin
        0.85,  // left margin
        bounds[2] - 0.85,  // bottom
        bounds[3] - 0.85   // right
    ];

    // Place content
    textFrame.contents = content;
    textFrame.parentStory.paragraphs.everyItem().appliedParagraphStyle = doc.paragraphStyles.item("Body Text");

    // Auto-flow to new pages
    while (textFrame.overflows && doc.pages.length < 400) {
        var newPage = doc.pages.add(LocationOptions.AT_END);

        var newTextFrame = newPage.textFrames.add();
        newTextFrame.geometricBounds = [
            0.85,
            0.85,
            newPage.bounds[2] - 0.85,
            newPage.bounds[3] - 0.85
        ];

        textFrame.nextTextFrame = newTextFrame;
        textFrame = newTextFrame;
    }

    // Apply markdown styles
    applyMarkdownStyles(doc);
}

function applyMarkdownStyles(doc) {

    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;

    // Find chapter headings (== )
    app.findGrepPreferences.findWhat = "^== .+$";
    app.changeGrepPreferences.appliedParagraphStyle = doc.paragraphStyles.item("Chapter Heading");
    doc.changeGrep();

    // Find section headings (=== )
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "^=== .+$";
    app.changeGrepPreferences.appliedParagraphStyle = doc.paragraphStyles.item("Section Heading");
    doc.changeGrep();

    // Remove markdown syntax (== and ===)
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
    app.findGrepPreferences.findWhat = "^=+ ";
    app.changeGrepPreferences.changeTo = "";
    doc.changeGrep();

    // Clean up preferences
    app.findGrepPreferences = NothingEnum.NOTHING;
    app.changeGrepPreferences = NothingEnum.NOTHING;
}

// ============================================================================
// RUN
// ============================================================================

main();
