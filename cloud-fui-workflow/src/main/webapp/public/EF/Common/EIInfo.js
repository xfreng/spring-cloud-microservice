/**
 * 构造 AbstractEi 对象.
 *
 * @class EiInfo 基类 eiblock,eiinfo,eicolumn,eiblockmeta都继承于此类
 * @constructor
 * @return A new AbstractEi
 */
function AbstractEi() {
    /**
     * AbstractEi 类的属性
     *
     * @type Object
     * @private
     */
    this.extAttr = {};
};
/**
 * 根据属性名得到属性值
 *
 * @param {String}
 *            prop : 属性名
 * @return {Object} : 属性名对应的值
 */
AbstractEi.prototype.get = function (prop) {
    return this.extAttr[prop];
};
/**
 * 设置属性值
 *
 * @param {Object}
 *            prop : 属性名
 * @param {Object}
 *            value ： 属性名对应的值
 */
AbstractEi.prototype.set = function (prop, value) {
    this.extAttr[prop] = value;
};
/**
 * 取得属性对象
 *
 * @return {Object} : 属性对象
 */
AbstractEi.prototype.getAttr = function () {
    return this.extAttr;
};
/**
 * 设置属性对象
 *
 * @param {Object}
 *            sAttr : 要设置的属性对象
 */
AbstractEi.prototype.setAttr = function (sAttr) {
    this.extAttr = sAttr;
};
/**
 * EiColumn列类
 *
 * @class EiColumn 类构造函数
 * @extends AbstractEi
 * @constructor
 * @param {Object}
 *            name : eicolumn 名称
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiColumn(name) {
    /**
     * @private
     */
    this.pos = -1;
    /**
     * @private
     */
    this.name = name;
    /**
     * @private
     */
    this.descName = "";
    /**
     * @private
     */
    this.type = "C";
    /**
     * @private
     */
    this.regex = null;
    /**
     * @private
     */
    this.formatter = null;
    /**
     * @private
     */
    this.editor = "text";
    /**
     * @private
     */
    this.minLength = 0;
    /**
     * @private
     */
    this.maxLength = Number.MAX_VALUE;
    /**
     * @private
     */
    this.primaryKey = false;
    /**
     * @private
     */
    this.nullable = true;
    /**
     * @private
     */
    this.visible = true;
    /**
     * @private
     */
    this.readonly = false;
    /**
     * @private
     */
    this.displayType = "text";
    /**
     * @private
     */
    this.errorPrompt = null;
    /**
     * @private
     */
    this.dateFormat = null;
    /**
     * @private
     */
    this.defaultValue = "";
    /**
     * @private
     */
    this.validateType = null;
    /**
     * @private
     */
    this.width = 96;
    /**
     * @private
     */
    this.height = 18;
    /**
     * @private
     */
    this.align = "left";
    /**
     * @private
     */
    this.blockName = null;
    /**
     * @private
     */
    this.sourceName = null;
    /**
     * @private
     */
    this.labelProperty = null;
    /**
     * @private
     */
    this.valueProperty = null;
    /**
     * @private
     */

    this.extAttr = {};
};

EiColumn.prototype = new AbstractEi;
/**
 * EiBlockMeta列头类
 *
 * @class EiBlockMeta 类构造函数
 * @extends AbstractEi
 * @constructor
 * @param {String}
 *            sBlockId : blockId
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiBlockMeta(sBlockId) {
    /**
     * @private
     */
    this.blockId = sBlockId;
    /**
     * @private
     */
    this.metas = {};
    /**
     * @private
     */
    this.extAttr = {};
    /**
     * @private
     */
    this.colCount = 0;
}
EiBlockMeta.prototype = new AbstractEi;
/**
 * 设置EiBlockMeta列头类的描述
 *
 * @param {String}
 *            sDesc ：列头描述信息
 */
EiBlockMeta.prototype.setDesc = function (sDesc) {
    this.desc = sDesc;
};
/**
 * 取得列头描述信息
 *
 * @return {String} : 列头描述
 */
EiBlockMeta.prototype.getDesc = function () {
    return this.desc;
};
/**
 * 添加列头信息
 *
 * @param {EiColumn}
 *            sEiColumn : 列信息
 * @throws Error异常
 */
EiBlockMeta.prototype.addMeta = function (sEiColumn) {
    if (sEiColumn instanceof EiColumn) {
        this.metas[sEiColumn.name] = sEiColumn;
        if (sEiColumn.pos < 0)
            sEiColumn.pos = this.colCount;
        this.colCount++;
    } else {
        throw new Error("Can NOT add as an EiColumn");
    }
};
/**
 * 取得列信息
 *
 * @param {String}
 *            sName : 列名称
 * @return {EiColumn} : 列信息
 * @exception 无异常抛出
 */
EiBlockMeta.prototype.getMeta = function (sName) {
    return this.metas[sName];
};


/**
 * 取得列信息
 *
 * @param {String}
 *            sName : 列名称
 * @return {EiColumn} : 列信息
 * @exception 无异常抛出
 */
EiBlockMeta.prototype.removeMeta = function (sName) {
    delete this.metas[sName];
};

/**
 * 取得列头所在的blockId
 *
 * @return {String} : 所在的blockId
 */
EiBlockMeta.prototype.getBlockId = function () {
    return this.blockId;
};
/**
 * 取得列头所有的列信息
 *
 * @return {Object} : 列头所有的列信息
 */
EiBlockMeta.prototype.getMetas = function () {
    return this.metas;
};

/**
 * EiBlock 对象构造函数
 *
 * @class EiBlock类
 * @constructor
 * @extends AbstractEi
 * @param {String}
 *            blockId : block的ID
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiBlock(blockId) {
    if (typeof blockId == "string") {
        /**
         * @private
         */
        this.meta = new EiBlockMeta(blockId);
    } else if (blockId instanceof EiBlockMeta) {
        /**
         * @private
         */
        this.meta = blockId;
    } else {
        throw new Error("Can NOT create block");
    }
    ;
    /**
     * @private
     */
    this.rows = new Array();
    /**
     * @private
     */
    this.colCount = 0;
    /**
     * @private
     */
    this.extAttr = {};
};

EiBlock.prototype = new AbstractEi;
/**
 * 取得block所在列的列头信息
 *
 * @return {Object} 返回block的列头信息
 */
EiBlock.prototype.getBlockMeta = function () {
    return this.meta;
};
/**
 * 设置block所在列的列头信息
 *
 * @param {Object}
 *            sBlockMeta : block所在列的列头信息
 *
 */
EiBlock.prototype.setBlockMeta = function (sBlockMeta) {
    this.meta = sBlockMeta;
};
/**
 * 给block所在列添加行数据
 *
 * @param {Object}
 *            sRow : 行数据
 */
EiBlock.prototype.addRow = function (sRow) {
    if (sRow == null) {
        this.rows.push({});
// this.rows[this.rows.length] = {};
    } else {
// this.rows[this.rows.length] = sRow;
        this.rows.push(sRow);
    }
};
/**
 * 取得block所在行数据
 *
 * @return {Object} : 返回block的行数据
 */
EiBlock.prototype.getRows = function () {
    return this.rows;
};
/**
 * 根据指定行号及列名,设定其数据值.
 *
 * @param {Object}
 *            sRowNo ：行号
 * @param {Object}
 *            sColName ：列名
 * @param {String}
 *            sValue ：数据值
 */
EiBlock.prototype.setCell = function (sRowNo, sColName, sValue) {
    var pos = this.getBlockMeta().getMeta(sColName).pos;
    while (typeof(this.rows[sRowNo]) == "undefined") this.addRow(null);
    this.rows[sRowNo][pos] = sValue;
};
/**
 * 根据指定行号、列名，取得数据值
 *
 * @param {Object}
 *            sRowNo ：行号
 * @param {Object}
 *            sColName ：列名
 * @return {String} value : 数据值
 */
EiBlock.prototype.getCell = function (sRowNo, sColName) {
    var column = this.getBlockMeta().getMeta(sColName);
    if (column) {
        var pos = this.getBlockMeta().getMeta(sColName).pos;
        return this.rows[sRowNo][pos];
    } else {
        return "";
    }
};
/**
 * 根据行号、列号，取得数据值
 *
 * @param {Object}
 *            sRowNo ：行号
 * @param {Object}
 *            sColPos ：列号
 * @return {String} value : 数据值
 */
EiBlock.prototype.getCellByPos = function (sRowNo, sColPos) {
    return this.rows[sRowNo][sColPos];
};
/**
 * @private
 * @param {Object}
 *            obj
 */
EiBlock.prototype.getMappedArray = function (obj) {
    var cols = this.getBlockMeta().getMetas();
    var row = new Array();
    for (var col in cols) {
        var pos = this.getBlockMeta().getMeta(col).pos;
        row[pos] = obj[col];
    }
    return row;
};
/**
 * @private
 * @param {Object}
 *            row
 */
EiBlock.prototype.getMappedObject = function (row) {
    var cols = this.getBlockMeta().getMetas();
    var t = new Object();
    for (var key in cols) {
        var col = cols[key];
        t[col.name] = row[col.pos];
    }
    return t;
};
/**
 * @private
 */
EiBlock.prototype.getMappedRows = function () {
    var ret = new Array();
    for (var i = 0; i < this.rows.length; i++) {
        var row = this.rows[i];
        var m = this.getMappedObject(row);
        ret.push(m);
    }
    return ret;
};
/**
 * @private
 */
EiBlock.prototype.clone = function () {
    return this;
}
/**
 * EiInfo 对象构造函数
 *
 * @class EiInfo类
 * @constructor
 * @extends AbstractEi
 * @param {String}
 *            sName : EiInfo名称
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiInfo(sName) {
    /**
     * @private
     */
    this.name = null;
    /**
     * @private
     */
    this.msg = null;
    /**
     * @private
     */
    this.msgKey = null;
    /**
     * @private
     */
    this.status = null;
    /**
     * @private
     */
    this.descName = null;
    /**
     * @private
     */
    this.blocks = {};
    /**
     * @private
     */
    this.extAttr = {};
    if (typeof sName == "string") {
        this.name = sName;
    }
}

EiInfo.prototype = new AbstractEi;
/**
 * 取得EiInfo 名称
 *
 * @return {String} : EiInfo名称
 */
EiInfo.prototype.getName = function () {
    return this.name;
};
/**
 * 设置EiInfo 名称
 *
 * @param {Object}
 *            sName ：EiInfo名称
 */
EiInfo.prototype.setName = function (sName) {
    this.name = sName;
};

/**
 * 以三段式的方式从EiInfo中获取某字段的值
 *
 * @param {String}
 *            str ：三段式blockName-sRowNum-sColName如"result-0-siteArticleButton"
 */
EiInfo.prototype.get = function (str) {

    if (!str)
        return null;

    var strArray = str.split("-");
    if (3 == strArray.length) {
        block = this.getBlock(strArray[0]);
        if (null != block)
            return block.getCell(parseInt(strArray[1]), strArray[2]);
        else
            return null;
    } else if (2 == strArray.length) {
        block = this.getBlock(strArray[0]);
        if (null != block)
            return block.get(strArray[1]);
        else
            return null;

    }
    return this.extAttr[strArray[0]];
}


/**
 * 设置EiInfo消息信息
 *
 * @param {String}
 *            sMsg ：消息信息
 */
EiInfo.prototype.setMsg = function (sMsg) {
    this.msg = sMsg;
};
/**
 * 取得EiInfo消息信息
 *
 * @return {String} : 消息信息
 */
EiInfo.prototype.getMsg = function () {
    return this.msg;
};
/**
 * 设置EiInfo消息信息键
 *
 * @param {Object}
 *            sMsgKey
 */
EiInfo.prototype.setMsgKey = function (sMsgKey) {
    this.msgKey = sMsgKey;
};
/**
 * 取得EiInfo消息信息键
 *
 * @return {Object} : 消息信息键
 */
EiInfo.prototype.getMsgKey = function () {
    return this.msgKey;
};
/**
 * 设置EiInfo的详细信息
 *
 * @param {Object}
 *            sMsg : 详细信息
 */
EiInfo.prototype.setDetailMsg = function (sMsg) {
    this.detailMsg = sMsg;
};
/**
 * 取得EiInfo的详细信息
 *
 * @return {Object} : 详细信息
 */
EiInfo.prototype.getDetailMsg = function () {
    return this.detailMsg;
};
/**
 * 设置EiInfo 状态
 *
 * @param {Object}
 *            s ： 状态
 */
EiInfo.prototype.setStatus = function (s) {
    this.status = s;
};
/**
 * 取得EiInfo状态
 *
 * @return {Object} : 状态
 */
EiInfo.prototype.getStatus = function () {
    return this.status;
};
/**
 * 设置EiInfo描述信息
 *
 * @param {Object}
 *            sDescName ：描述信息
 */
EiInfo.prototype.setDescName = function (sDescName) {
    this.descName = sDescName;
};
/**
 * 取得EiInfo描述信息
 *
 * @return {Object} : 描述信息
 */
EiInfo.prototype.getDescName = function () {
    return this.descName;
};
/**
 * 给EiInfo添加EiBlock块
 *
 * @param {Object}
 *            sBlock
 * @see EiBlock
 */
EiInfo.prototype.addBlock = function (sBlock) {
    this.blocks[sBlock.getBlockMeta().getBlockId()] = sBlock;
};
/**
 * 根据BlockId从EiInfo取得EiBlock块
 *
 * @param {Object}
 *            sBlockId
 * @return {EiBlock} : EiBlock块
 * @see EiBlock
 */
EiInfo.prototype.getBlock = function (sBlockId) {
    return this.blocks[sBlockId];
};
/**
 * 取得EiInfo所有的EiBlock块
 *
 * @return {Object} : EiBlock块
 */
EiInfo.prototype.getBlocks = function () {
    return this.blocks;
};
/**
 * 根据key名,按照块名、行号、列名规则，以'-'分隔，设置其值.
 *
 * @return null
 */
EiInfo.prototype.set = function () {
// 按照块名、行号、列名三段式参数解析
    if (arguments.length == 2) {
        // 设置eiinfo的属性值
        AbstractEi.prototype.set.apply(this, arguments);
        return;
    }
    // debugger;
    var sBlock = arguments[0];
    if (typeof(this.blocks[sBlock]) == "undefined") {
        this.blocks[sBlock] = new EiBlock(sBlock);
    }
    if (arguments.length == 3) {
        // 设置eiblock的属性值
        this.blocks[sBlock].set(arguments[1], arguments[2]);
        return;
    }
    if (arguments.length == 4) {
        // 设置eiblock的行、列值
        if (typeof(this.blocks[sBlock].getBlockMeta().getMeta(arguments[2])) == "undefined") {
            var cc = new EiColumn(arguments[2]);

            cc.pos = this.blocks[sBlock].colCount++;

            this.blocks[sBlock].getBlockMeta().addMeta(cc);
        }
        this.blocks[sBlock].setCell(arguments[1], arguments[2], arguments[3]);
        return;
    }
}
/**
 * 根据DOM的ID把其值设置到EiInfo对应的EiBlock块中 ID按照块名、行号、列名规则，以'-'分隔
 *
 * @param {Object}
 *            id_in : DOM的ID
 */
EiInfo.prototype.setById = function (id_in) {
    this.setByNameValue(id_in, ef.get(id_in).value);
}
/**
 * 根据key名,按照块名、行号、列名规则，以'-'分隔，设置其值.
 *
 * @param {Object}
 *            id_in : key名
 * @param {Object}
 *            v ： 欲设置的值
 */
EiInfo.prototype.setByNameValue = function (id_in, v) {

    var idArray = id_in.split("-");
    if (idArray.length == 3) return this.set(idArray[0], idArray[1], idArray[2], v);
    if (idArray.length == 2) return this.set(idArray[0], idArray[1], v);
    if (idArray.length == 1) return this.set(idArray[0], v);
}
/**
 * 把DOM节点以及其包含的子节点值根据其ID，设置到EiInfo中去 ID按照块名、行号、列名规则，以'-'分隔
 *
 * @param {Object}
 *            node_id_in : DOM节点对应的ID
 */
EiInfo.prototype.setByNode = function (node_id_in) {
    this.setByNodeObject(ef.get(node_id_in));
}
/**
 * @private
 * @param {Object}
 *            node_in
 */
EiInfo.prototype.setByNodeObject = function (node_in) {
    var cbs = new Object();
    var nodes = node_in.getElementsByTagName("input");
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].type == "radio" && !nodes[i].checked)
            continue;
        if (nodes[i].type == "checkbox") {
            if (nodes[i].checked)
                if (cbs[nodes[i].name] === undefined)
                    cbs[nodes[i].name] = nodes[i].value;
                else
                    cbs[nodes[i].name] = cbs[nodes[i].name] + ',' + nodes[i].value;
            continue;
        }

        this.setByNameValue(nodes[i].name, nodes[i].value);
    }
    for (var cbname in cbs)
        this.setByNameValue(cbname, cbs[cbname]);

    nodes = node_in.getElementsByTagName("select");
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].multiple) {
            if (nodes[i].options.length > 0)
                if (nodes[i].selectedIndex >= 0) {
                    this.setByNameValue(nodes[i].name, nodes[i].options[nodes[i].selectedIndex].value);
                }
                else {
                    this.setByNameValue(nodes[i].name, "");
                }
        }
        else {
            var val = [];
            for (var j = 0; j < nodes[i].options.length; j++) {
                var node = nodes[i][j];
                if (node.selected === true) {
                    val.push(node.value);
                }
            }
            this.setByNameValue(nodes[i].name, val.join(','));
        }
    }
    var nodes = node_in.getElementsByTagName("textarea");
    for (var i = 0; i < nodes.length; i++) {
        this.setByNameValue(nodes[i].name, nodes[i].value);
    }
}

/* EiInfo 2 Json */
/**
 * @private
 * @ignore
 */
var EiInfoJsonConstants = {
    ATTRIBUTES: "attr",
    EIINFO_NAME: "name",
    EIINFO_DESC_NAME: "descName",
    EIINFO_MESSAGE: "msg",
    EIINFO_MESSAGE_KEY: "msgKey",
    EIINFO_DETAIL_MESSAGE: "detailMsg",
    EIINFO_STATUS: "status",
    EIINFO_BLOCKS: "blocks",
    BLOCK_META: "meta",
    BLOCK_META_DESC: "desc",
    BLOCK_META_COLUMNLIST: "columns",
    BLOCK_META_COLUMNPOS: "columnPos",
    BLOCK_DATA: "rows"
};
/**
 * @ignore
 * @param {Object}
 *            obj
 */
function formatNative(obj) {
    var str = JSON2String(obj);
    // 这段代码主要是为了解决ajax的data以字符串的方式提交时+和%引起的过滤问题
    // 后来ajax的data以对象方式提交同时也避免了这个问题 所以需要把这段代码注释掉
    // if(undefined != str)
    // return str.replace(/\%/g,'%25').replace(/\+/g, '%2B');
    // else
    return str;
}

/**
 * 判断某一对象是否为空。
 *
 * @param {Object}
 *            obj : 所要判断的对象
 * @return {boolean} : 若obj为空对象(null或undefined)或是空字符串("")， 返回false，否则返回true。
 * @exception 无异常抛出
 */
function isAvailable(obj) {
    if (obj === undefined) {
        return false;
    }
    ;
    if (obj === null) {
        return false;
    }
    if (obj === "") {
        return false;
    }
    ;
    return true;
}

/**
 * 判断某一对象数组是否每个元素可用。
 *
 * @param {Array}
 *            obj : 所要判断的对象数组
 * @return {boolean} : 若obj为每一个元素都为非空对象(null或undefined)或是空字符串("")
 *         返回true，否则返回false。
 * @exception 无异常抛出
 */
function isBatchAvailable(array) {
    for (var obj in array) {
        if (obj === undefined) {
            return false;
        }
        ;
        if (obj === null) {
            return false;
        }
        if (obj === "") {
            return false;
        }
        ;
    }
    return true;
}

/**
 * @private
 */
function EiInfo2Json() {
};
/**
 * @private
 * @param {Object}
 *            sEiInfo
 */
EiInfo2Json.prototype.EiInfo2JsonString = function (sEiInfo) {
    var a = ['{'];
    var appendComma;

    if (isAvailable(sEiInfo.getName())) {
        a.push(EiInfoJsonConstants.EIINFO_NAME, ':', formatNative(sEiInfo.getName()));
        appendComma = true;
    }
    if (isAvailable(sEiInfo.getDescName())) {
        if (appendComma) {
            a.push(',');
        }
        ;
        a.push(EiInfoJsonConstants.EIINFO_DESC_NAME, ':', formatNative(sEiInfo.getDescName()));
        appendComma = true;
    }

    if (isAvailable(sEiInfo.getAttr())) {
        if (appendComma) {
            a.push(',');
        }
        ;
        a.push(EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sEiInfo.getAttr()));
        appendComma = true;
    }

    if (appendComma) {
        a.push(',');
    }
    ;
    a.push(EiInfoJsonConstants.EIINFO_BLOCKS, ':{');


    var blocks = sEiInfo.getBlocks();
    var b;
    for (var iKey in blocks) {
        var block = blocks[iKey];
        if (b) {
            a.push(',');
        }
        a.push(iKey, ':', EiInfo2Json.prototype.EiBlock2JsonString(block));
        b = true;
    }
    a.push('}}');
    return a.join('');
};
/**
 * @private
 * @param {Object}
 *            sBlock
 */
EiInfo2Json.prototype.EiBlock2JsonString = function (sBlock) {
    var a = ['{'];

    a.push(EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sBlock.getAttr()));
    a.push(',', EiInfoJsonConstants.BLOCK_META, ':', EiInfo2Json.prototype.EiBlockMeta2JsonString(sBlock.getBlockMeta()));

    a.push(',', EiInfoJsonConstants.BLOCK_DATA, ':[');

    var rows = sBlock.getRows();
    var b;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (b) {
            a.push(',');
        }
        a.push('[');
        var columns = sBlock.getBlockMeta().getMetas();
        var c;
        for (var jKey in columns) {
            var column = columns[jKey];
            if (c) {
                a.push(',');
            }
            ;
            a.push(formatNative(row[column.pos]));
            c = true;
        }
        b = true;
        c = false
        a.push(']');
    }

    a.push(']}');
    return a.join('');
};
/**
 * @private
 * @param {Object}
 *            sBlockMeta
 */
EiInfo2Json.prototype.EiBlockMeta2JsonString = function (sBlockMeta) {
    var a = ['{'];
    var appendComma;
    if (isAvailable(sBlockMeta.getDesc())) {
        a.push(EiInfoJsonConstants.BLOCK_META_DESC, ':', formatNative(sBlockMeta.getDesc()));
        appendComma = true;
    }
    if (isAvailable(sBlockMeta.getAttr())) {
        if (appendComma) {
            a.push(',');
        }
        ;
        a.push(EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sBlockMeta.getAttr()));
        appendComma = true;
    }
    if (appendComma) {
        a.push(',');
    }
    ;
    a.push(EiInfoJsonConstants.BLOCK_META_COLUMNLIST, ':[');

    var columns = sBlockMeta.getMetas();
    var b;
    for (var iKey in columns) {
        var column = columns[iKey];
        if (b) {
            a.push(',');
        }
        a.push(EiInfo2Json.prototype.EiColumn2JsonString(column));
        b = true;
    }

    a.push(']}');
    return a.join('');
};
/**
 * @private
 * @param {Object}
 *            sColumn
 */
EiInfo2Json.prototype.EiColumn2JsonString = function (sColumn) {
    var a = ['{'];

    a.push('name', ':', formatNative(sColumn.name));
    a.push(',');
    a.push('descName', ':', formatNative(sColumn.descName));
    a.push(',');
    a.push('type', ':', formatNative(sColumn.type));
    a.push(',');
    a.push('scaleLength', ':', formatNative(sColumn.scaleLength || 0));

    a.push('}');
    return a.join('');
}
/**
 * @private
 */
function Json2EiInfo() {
};
/**
 * @private
 * @param {Object}
 *            sJson
 */
Json2EiInfo.prototype.parseString = function (sJson) {
    var eiJson = eval("(" + sJson + ")");
    Json2EiInfo.prototype.parseJson(eiJson);
}

/**
 * @private
 * @param {Object}
 *            eiJson
 */
Json2EiInfo.prototype.parseJsonObject = function (eiJson) {
    var eiInfo = new EiInfo();

    var value = eiJson[EiInfoJsonConstants.EIINFO_NAME];
    if (isAvailable(value)) {
        eiInfo.setName(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_DESC_NAME];
    if (isAvailable(value)) {
        eiInfo.setDescName(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_MESSAGE];
    if (isAvailable(value)) {
        eiInfo.setMsg(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_MESSAGE_KEY];
    if (isAvailable(value)) {
        eiInfo.setMsgKey(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_DETAIL_MESSAGE];
    if (isAvailable(value)) {
        eiInfo.setDetailMsg(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_STATUS];
    if (isAvailable(value)) {
        eiInfo.setStatus(value);
    }

    var value = eiJson[EiInfoJsonConstants.ATTRIBUTES];
    if (isAvailable(value)) {
        eiInfo.setAttr(value);
    }

    var value = eiJson[EiInfoJsonConstants.EIINFO_BLOCKS];
    if (isAvailable(value)) {
        for (var bIds in value) {
            var block = Json2EiInfo.prototype.parseBlock(bIds, value[bIds]);
            eiInfo.addBlock(block);
        }
    }

    return eiInfo;
};

/**
 * @private
 * @param {Object}
 *            sId
 * @param {Object}
 *            blockJson
 */

Json2EiInfo.prototype.parseBlock = function (sId, blockJson) {

    var block;
    var value = blockJson[EiInfoJsonConstants.BLOCK_META];
    if (isAvailable(value)) {
        var blockMeta = Json2EiInfo.prototype.parseBlockMeta(sId, value);
        block = new EiBlock(blockMeta);
    } else {
        block = new EiBlock(sId);
    }

    var value = blockJson[EiInfoJsonConstants.ATTRIBUTES];
    if (isAvailable(value)) {
        block.setAttr(value);
    }

    var value = blockJson[EiInfoJsonConstants.BLOCK_DATA];
    if (isAvailable(value)) {

// 直接赋值
        block.rows = value;

    }
    return block;
}
/**
 * @private
 * @param {Object}
 *            sId
 * @param {Object}
 *            blockJson
 */
Json2EiInfo.prototype.parseBlockMeta = function (sId, blockJson) {
    var blockMeta = new EiBlockMeta(sId);
    var value = blockJson[EiInfoJsonConstants.BLOCK_META_DESC];
    if (isAvailable(value)) {
        blockMeta.setDesc(value);
    }
    var value = blockJson[EiInfoJsonConstants.ATTRIBUTES];
    if (isAvailable(value)) {
        blockMeta.setAttr(value);
    }
    var value = blockJson[EiInfoJsonConstants.BLOCK_META_COLUMNLIST];
    if (isAvailable(value)) {		// value should be Array
        for (var i = 0; i < value.length; i++) {
            var column = Json2EiInfo.prototype.parseColumn(value[i]);
            blockMeta.addMeta(column);
        }
    }
    return blockMeta;
}
/**
 * @private
 * @param {Object}
 *            blockJson
 */
Json2EiInfo.prototype.parseColumn = function (blockJson) {

    var column = new EiColumn(blockJson.name);

    for (var iKey in blockJson) {
        var columnValue = blockJson[iKey];
        if (columnValue.replace)
            columnValue = columnValue.replace(/'/g, "&#39;");

        eval("column." + iKey + "='" + columnValue + "'");
    }

    return column;
}

/**
 * @ignore ei communication
 */
var ajaxEi = new EiInfo();
/**
 * @ignore
 * @param {Object}
 *            sService
 * @param {Object}
 *            sMethod
 * @param {Object}
 *            sEiInfo
 * @param {Object}
 *            sCallback
 * @param {Object}
 *            hasForm
 * @param {Object}
 *            ajaxMode
 */
var EiCommunicator = {
    send: function (sService, sMethod, sEiInfo, sCallback, hasForm, ajaxMode, noloading) {
        var modalWin = null;
        var resizeFunc = null;
        if (document.forms.length > 0 && !noloading) {
            resizeFunc = window.onresize;
            window.onresize = null;
            modalWin = new EFModalWindow('iplat-progressWindow');
            modalWin.showProgressBar();
        }

        if (hasForm != false) {
            efform.setStatus(999, "[" + sService + "." + sMethod + "]调用执行中...");
        }

        if (ajaxMode != true) ajaxMode = false;

        var jsonEi = EiInfo2Json.prototype.EiInfo2JsonString(sEiInfo);
        var efSecurityToken = $('#efSecurityToken').val();
        $.ajax(
            {
                type: "POST",
                async: ajaxMode,
                url: "/supervisor/EiService",
                data: {service: sService, method: sMethod, eiinfo: jsonEi, efSecurityToken: efSecurityToken},
                dataType: "json",
                success: function (msg) {
                    ajaxEi = Json2EiInfo.prototype.parseJsonObject(msg);
                    var r = ajaxEi.get("redirect");
                    if (r != null) {
                        self.location = r;
                    } else {
                        if (hasForm != false) {
                            // ajax提交时刷新状态、消息等
                            //判断ajax是否有返回消息 如果没有改成显示系统消息
                            if (efutils.trimString(ajaxEi.msg) == "") {
                                efform.setStatus(0, "[" + sService + "." + sMethod + "]调用完成");
                                efform.setDetailMsg("");
                            } else {
                                efform.setStatus(ajaxEi.status, ajaxEi.msg, ajaxEi.msgKey);
                                efform.setDetailMsg(ajaxEi.detailMsg);
                            }
                        }
                        if ((typeof( sCallback ) == "object") && (sCallback != null)) {
                            if (typeof( sCallback.onSuccess ) == "function") sCallback.onSuccess(ajaxEi);
                        }
                    }
                    if (modalWin != null) {
                        modalWin.hide();
                        window.onresize = resizeFunc;
                    }
                },
                error: function (xmlR, status, e) {
                    ajaxEi = null;
                    // 获取到详细信息，与后台协定$$$分隔
                    var detailMsg = xmlR.responseText.split("$$$")[1];
                    if (hasForm != false) {
                        efform.setStatus(-1, "[" + sService + "." + sMethod + "]" + getI18nMessages("ef.CallFailed", "调用失败，原因") + "[" + xmlR.responseText.split("$$$")[0] + "]");
                        efform.setDetailMsg(detailMsg);
                    } else {
                        if (sCallback != null && typeof( sCallback ) == "object") {
                            if (typeof( sCallback.onFail ) == "function")
                                sCallback.onFail(xmlR.responseText.split("$$$")[0], status, e);
                        }
                    }
                    if (modalWin != null) {
                        modalWin.hide();
                        window.onresize = resizeFunc;
                    }
                }
            });
    },
    sendRemote: function (sRemoteUrl, sRemoteKey, sService, sMethod, sEiInfo, sCallback, hasForm, ajaxMode, noloading) {
        var modalWin = null;
        var resizeFunc = null;
        if (document.forms.length > 0 && !noloading) {
            resizeFunc = window.onresize;
            window.onresize = null;
            modalWin = new EFModalWindow('iplat-progressWindow');
            modalWin.showProgressBar();
        }

        if (hasForm != false) {
            efform.setStatus(999, "[" + sService + "." + sMethod + "]调用执行中...");
        }

        if (ajaxMode != true) ajaxMode = false;

        var jsonEi = EiInfo2Json.prototype.EiInfo2JsonString(sEiInfo);
        var efSecurityToken = $('#efSecurityToken').val();
        $.ajax(
            {
                type: "GET",
                async: ajaxMode,
                url: sRemoteUrl + "/JsonPService" + "?" + sRemoteKey,
                callback: "callback",
                data: {service: sService, method: sMethod, eiinfo: jsonEi, efSecurityToken: efSecurityToken},
                dataType: "jsonp",
                success: function (msg) {
                    ajaxEi = Json2EiInfo.prototype.parseJsonObject(msg);
                    var r = ajaxEi.get("redirect");
                    if (r != null) {
                        self.location = r;
                    } else {
                        if (hasForm != false) {
                            // ajax提交时刷新状态、消息等
                            //判断ajax是否有返回消息 如果没有改成显示系统消息
                            if (efutils.trimString(ajaxEi.msg) == "") {
                                efform.setStatus(0, "[" + sService + "." + sMethod + "]调用完成");
                                efform.setDetailMsg("");
                            } else {
                                efform.setStatus(ajaxEi.status, ajaxEi.msg, ajaxEi.msgKey);
                                efform.setDetailMsg(ajaxEi.detailMsg);
                            }
                        }
                        if ((typeof( sCallback ) == "object") && (sCallback != null)) {
                            if (typeof( sCallback.onSuccess ) == "function") sCallback.onSuccess(ajaxEi);
                        }
                    }
                    if (modalWin != null) {
                        modalWin.hide();
                        window.onresize = resizeFunc;
                    }
                },
                error: function (xmlR, status, e) {
                    ajaxEi = null;
                    // 获取到详细信息，与后台协定$$$分隔
                    var detailMsg = xmlR.responseText.split("$$$")[1];
                    if (hasForm != false) {
                        efform.setStatus(-1, "[" + sService + "." + sMethod + "]" + getI18nMessages("ef.CallFailed", "调用失败，原因") + "[" + xmlR.responseText.split("$$$")[0] + "]");
                        efform.setDetailMsg(detailMsg);
                    } else {
                        if (sCallback != null && typeof( sCallback ) == "object") {
                            if (typeof( sCallback.onFail ) == "function")
                                sCallback.onFail(xmlR.responseText.split("$$$")[0], status, e);
                        }
                    }
                    if (modalWin != null) {
                        modalWin.hide();
                        window.onresize = resizeFunc;
                    }
                }
            });
    },
    // func call
    sendFuncCall: function (funcId, inInfo, callback) {

        inInfo.set("funcId", funcId);
        EiCommunicator.send("EPFunc", "call", inInfo, callback, false);

    },
    $send: function (sUrl, sContent, sCallback) {
        // 判断是否超时
        if ('function' == typeof(checkTimeOut)) {
            if (checkTimeOut()) {
                return;
            }
        }
        $.ajax(
            {
                type: "POST",
                async: false,
                url: sUrl,
                data: sContent,
                dataType: "json",
                success: function (msg) {
                    ajaxEi = Json2EiInfo.prototype.parseJsonObject(msg);
                    sCallback.onSuccess(ajaxEi);
                },
                error: function (xmlR, status, e) {
                    sCallback.onFail(xmlR, status, e);
                }
            });
    }

};	 