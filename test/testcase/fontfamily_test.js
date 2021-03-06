function runFontFamilyTest(range, fontfamily, expectedContent, expectedSelectedText) {
    range.select();
    assi.assertToolExecution("fontfamily", fontfamily, function() {
        assertFontFamilyResult(expectedContent, expectedSelectedText);
    });
}

function assertFontFamilyResult(expectedContent, expectedSelectedText) {
    htmlEqual(assi.getContent(), expectedContent);
    var selectedText = goog.dom.Range.createFromWindow(assi.win).getText();
    regexpEqual(selectedText, expectedSelectedText);
}


module("fontfamily");

test("fontfamily queryCurrentStyle : Gulim", function() {
    var p = ax.p(ax.span({id: "span", style: { fontFamily: "Gulim" }}, "Hello World"));
    assi.setContentElement(p);
    var range = new goog.dom.Range.createFromNodes(assi.$('span').firstChild, 2, assi.$('span').firstChild, 2);
    range.select();
    equal(assi.getTool('fontfamily').queryCurrentStyle(range), "굴림");
});

test("collapsed에서 fontfamily를 Gulim으로 변경하기", function() {
    var p = ax.p(ax.span({id: "span"}, "Hello World"));
    assi.setContentElement(p);
    var range = new goog.dom.Range.createFromNodes(assi.$('span').firstChild, 2, assi.$('span').firstChild, 2);
    var expectedContent = '<P><SPAN id=span>He<SPAN style="font-family: Gulim"></SPAN>llo World</SPAN></P>';
    runFontFamilyTest(range, "Gulim", expectedContent, "");
});

test("selected에서 fontfamily를 Gulim에서 Batang으로 변경하기", function() {
    var p = ax.p(ax.span({id: "span", style: { fontFamily: "Gulim" }}, "Hello World"));
    assi.setContentElement(p);
    var range = new goog.dom.Range.createFromNodes(assi.$('span').firstChild, 2, assi.$('span').firstChild, 3);
    var expectedContent = '<P><SPAN id=span style="font-family: Gulim">He<SPAN style="font-family: Batang">l</SPAN>lo World</SPAN></P>';
    runFontFamilyTest(range, "Batang", expectedContent, "l");
});

test("웹폰트는 IE에서만 적용된다. (but myeditor.daum.net 등에서만 제대로 보여진다)", function() {
    expect(3);
    var p = ax.p(ax.span({id: "span"}, "Hello World"));
    assi.setContentElement(p);
    var range = new goog.dom.Range.createFromNodes(assi.$('span').firstChild, 2, assi.$('span').firstChild, 3);
    range.select();
    var fontfamily = "MD_diary";
    
    assi.executeTool("fontfamily", fontfamily);
    QUnit.stop(1000);
    setTimeout(function() {
        setTimeout(function() {
        	var expectedContent = '<P><SPAN id=span>He<SPAN style="font-family: MD_diary">l</SPAN>lo World</SPAN></P>';
            var expectedSelectedText = 'l';
            assertFontFamilyResult(expectedContent, expectedSelectedText);
            var usedWebfonts = assi.canvas.getPanel('html').getUsedWebfont();
            if ($tx.msie) {
                equal(usedWebfonts.length, 1);
            } else {
                equal(usedWebfonts.length, 0);
            }
            QUnit.start();
        }, 20);
    }, 0);
});
