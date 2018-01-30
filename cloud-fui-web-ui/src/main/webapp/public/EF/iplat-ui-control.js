efImportFile = function (libraryName) {
    document.write('<script type="text/javascript" src="' + libraryName + '"></script>');
};

//定义引用文件清单
var _iplat_ui_include_files = [
    "/public/EF/jQuery/jquery.ba-resize.min.js",
    "/public/EF/jQuery/jquery.tab.js",
    "/public/EF/jQuery/jquery.treeTable.js",
    "/public/EF/jQuery/jquery.flexbox.js",
    "/public/EF/jQuery/jquery.colorbox.js",

    "/public/EF/Common/EIInfo.js",
    "/public/EF/Common/json_util.js",
    "/public/EF/Common/iplat.ui.core.js",
    "/public/EF/Common/iplat.ui.ico.js",
    "/public/EF/Common/iplat.ui.utils.js",
    "/public/EF/Common/iplat.ui.domUtils.js",

    "/public/EF/Form/iplat.ui.form.js",

    "/public/EF/FeedBack/canvas2image.js",
    "/public/EF/FeedBack/feedback.js",
    "/public/EF/FeedBack/html2canvas.min.js",

    "/public/EF/jQuery/iplat.ui.button.js",

    "/public/EF/Tree/iplat.ui.accordionTree.js",
    "/public/EF/Tree/iplat.ui.treeModel.js",
    "/public/EF/Tree/iplat.ui.treeTemplate.js",
    "/public/EF/Tree/iplat.ui.tree.js",
    "/public/EF/Tree/iplat.ui.menuTree.js",
    "/public/EF/Tree/iplat.ui.menu.js",

    "/public/EF/Common/iplat.ui.debugger.js",

    "/public/EF/Common/iplat.ui.scrolltop.js"
];
for (var index in _iplat_ui_include_files) {
    efImportFile(_iplat_ui_include_files[index]);
}