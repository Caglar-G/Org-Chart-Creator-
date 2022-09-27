import {ColorMap, Color} from './ColorModule.js';

export class OrgChart
{
    constructor(options)
    {   
        this.WhereToAdd = document.querySelector(options.WhereToAdd);
        this.JSON_Data = options.JSON_Data;

        this.svgMain = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  

        this.svgMain.appendChild(this.svg);

        this.WhereToAdd.appendChild( this.svgMain );

        this.boxSpec = {
        
            width:200,
            height:150,
            middle:100
        }

        this.paddingBetweenBox = 70;

        this.rowSayac = 0;

        this.multiParent_parent_ref_Sayac = 0;

        this.JSON_Data.forEach(t=>{
            if(t.ParentId != null && Array.isArray(t.ParentId) == false)
            {
                const old = t.ParentId;
                t.ParentId = [old.toString()];
            }
        })

        this.protection = {
            p1:{
                max:100000,
                now:0,
            },
            p2:{
                max:100000,
                now:0,
            },
            p3:{
                max:100000,
                now:0,
            },
            p4:{
                max:100000,
                now:0,
            },
            p5:{
                max:100000,
                now:0,
            },
        }

        this.Referance = this.boxSpec.middle;

        this._DataInterpret();
        
    }

    _DataInterpret()
    {
        const data = this.JSON_Data;
        var yorumlanan_veri = {
            boxs:[],
            arrow:[],
            table:{
                lastCol:0,
                lastRow:0
            }
        };
        var aranan_ids = null;
        for (var row_sayac = 0; row_sayac < 100; row_sayac++) {
            var rows_data ;
            if(aranan_ids == null)
            {
                rows_data = data.filter(x => x.ParentId == aranan_ids);
            }
            else{


                rows_data = data.filter(c => c.ParentId != null).filter(function (el) {
        

                    var res = false;

                    for (let index = 0; index < el.ParentId.length; index++) {
                        const element = el.ParentId[index];
                    
                        if(aranan_ids.indexOf(element) != -1)
                        {
                    
                            res = true;
                            
                        }
                        
                    }

                    return res;
                    
                    for (const key in el.ParentId) {
                        
                    }
                }); 

                

                if(rows_data.length == 0)
                {
                    row_sayac = 101;
                    break;
                }

                
                var _branch = []
                rows_data.forEach((el, index, self) => {
                    _branch.push(el.ParentId); 
                });


                function arrays_equal(a,b) { return !!a && !!b && !(a<b || b<a); }
                Array.prototype.unique = function() {
                    var a = [];
                    for (var i = 0, l = this.length; i<l; i++) {
                        for (var j = i + 1; j < l; j++) if (arrays_equal(this[i], this[j])) j = ++i;
                        a.push(this[i]);
                    }
                    return a;
                };

                var ret = _branch.unique();

    
                //////////////console.error(rows_data);

                ret.forEach((el, index, self) => {
        
                    
                    var ty = (rows_data.filter(x => {

                        var rt = true;
                        if(el.length != x.ParentId.length)
                        {
                            return false;
                        }
                        for (let index = 0; index < el.length; index++) {
                            const element = el[index];

                            if(x.ParentId.indexOf(element) == -1)
                            {
                                rt = false;
                            }
                            
                        }

                        if(rt == true)
                        {
                            return true;
                        }
                        else{
                            return false;
                        }

                        

                    }));

            
                
                    ty.forEach(y =>{
                        y._branch = index;
                        //y._branch_tree = branch_tree_create(y)
                    })
                
                });
                
            
            }

            aranan_ids = [];

            
            
            if(rows_data.length == 0)
            {
                row_sayac = 101;
            }


            
            
            for (let col_sayac = 0; col_sayac < rows_data.length; col_sayac++) {

                const col_data = rows_data[col_sayac];

                aranan_ids.push(col_data.Id);



                col_data._row = row_sayac;
                col_data._col = col_sayac;
                yorumlanan_veri.table.lastRow = row_sayac;
                col_data._top = ((row_sayac) * this.boxSpec.height) + ((row_sayac)*((this.boxSpec.width*this.paddingBetweenBox/100)));
                col_data._left = null;
                col_data._middle = null;
                col_data._draw = false;
                
                yorumlanan_veri.boxs.push(col_data);
            }

            if(rows_data.length == 0)
            {
                row_sayac = 101;
            }

        
        }

        const arrayUniqueByKey = [...new Map(yorumlanan_veri.boxs.map(item =>
        [item["Id"], item])).values()];
        this.data = {
            boxs:arrayUniqueByKey,
            arrow:[],
            table:yorumlanan_veri.table
        }

        this.data.boxs.forEach(by => {
            if(by.ParentId != null && by.ParentId.length > 1 ){
                by.multiple = true;
                const _temp = by.ParentId ;
                by.ParentId = [_temp[0]];
                by.multipleParent = _temp;
            } 
            else{
                by.multiple = false;
            }
        })



        this._ElementCalculate();
    }

    _ElementCalculate()
    {
        ////console.log(this.data);

        /*for (let index = 0; index < this.data.table.lastRow+1; index++) {

            
            this.data.boxs.filter(x=>x._row == index).forEach((element,ind) => {
            
                //this._calculate(element);
                ////console.log(element)
    
            
            });
            
        }*/

        var firstRow = this.data.boxs.filter(x=> x._row == 0);

        firstRow.forEach((now_element_child,index,arry)=>
        {
            this._DuzSirala(now_element_child);
        })
        
        
        this._draw();

    }
    _DuzSirala(el){
        
        const row = el._row;
        const col = el._col;
        const beforeEl = col == 0 ? { } :this.data.boxs.find(t=>t._row==row && t._col==col-1);
        const beforeRefMiddle = col == 0 ? 0 : beforeEl._middle;

        if(col == 0 && row == 0) //for root
        {
            el._middle = this.boxSpec.middle;
            el._draw = true;
            //this._draw();
        }
        else {
            const old_el_middle = el._middle ;
            el._middle = beforeRefMiddle+this.boxSpec.width+this.paddingBetweenBox ;
            el._draw = true;
            //this._draw();

            if(old_el_middle == null){
                this._swiftUpperBranch(el,this.boxSpec.middle+(this.paddingBetweenBox/2));
            }
            else{
                this._swiftUpperBranch(el, el._middle-old_el_middle);
            }
            
            //this._swiftUpperBranch(el, el._middle-old_el_middle);
        
            
        }


        var now_element_childs = this.data.boxs.filter(t=>t.ParentId != null 
            && t.ParentId.indexOf(el.Id) != -1)


        now_element_childs.forEach((now_element_child,index,arry) => {
            if(index==0)
            {
                this._ChildrenGecis(beforeEl,el,now_element_child,arry);
            }
            else {
                this._DuzSirala(now_element_child);
                
            }
        
        });

    
    
    }

    _ChildrenGecis(beforeParent,parent,firstchild,allchild)
    {
        const beforeParent_children = this.data.boxs.filter(t=>t.ParentId != null 
            && t.ParentId.indexOf(beforeParent.Id) != -1)
            
        const beforeParent_children_last = beforeParent_children[beforeParent_children.length-1]

        if(beforeParent_children.length > 1){
        
            const old_parent_middle = parent._middle ;
            parent._middle = beforeParent_children_last._middle + this.boxSpec.width + this.paddingBetweenBox;
            firstchild._middle = parent._middle ; 
            firstchild._draw = true;
            //this._draw();
            this._swiftUpperBranch(parent,parent._middle-old_parent_middle);
        }
        /*else if(allchild.length )
        {
        
        }*/
        else{
            firstchild._middle = parent._middle ; 
            firstchild._draw = true;

        }
        
        
        
        //this._draw();

        const firstchild_children = this.data.boxs.filter(t=>t.ParentId != null 
            && t.ParentId.indexOf(firstchild.Id) != -1)



        firstchild_children.forEach((firstchild_child,index,arry) => {
            if(index==0)
            {
                const beforeEl = firstchild._col == 0 ? { } :this.data.boxs.find(t=>t._row==firstchild._row && t._col==firstchild._col-1);

                this._ChildrenGecis(beforeEl,firstchild,firstchild_child,arry);
            }
            else {
                this._DuzSirala(firstchild_child);
                
            }
        
        });
        

    }


    _swiftUpperBranch(el,swift)
    {
        
        var swiftList = this.data.boxs.filter(t=>t.Id == el.ParentId);

        swiftList.forEach(y =>{

            y._middle += swift;
            //this._draw();

            if(el.ParentId != null)
            {
                this._swiftUpperBranch(y,swift);
            }

        })
        
    }

    _check_first_child(el)
    {   
        const parent = this.data.boxs.find(t=>t.Id == el.ParentId[0]);
        const firstChild = this.data.boxs.filter(t=>t.ParentId != null 
            && t.ParentId.indexOf(el.ParentId[0]) != -1)[0];

        if(el.Id == firstChild.Id)
        {
            return true;
        }
        else{
            return false;
        }

    }
    

    _draw()
    {
        this.svgMain.removeAttribute("viewBox");
        this._drawing_data = {};
    
        this.multiParent_parent_ref_Sayac = 0;
        this._drawing_data.boxs = this.data.boxs.filter(x => x._draw == true);

    
        this.colorPaletta = new ColorMap((this.data.table.lastRow+1) < 2 ? 2:(this.data.table.lastRow+1) , [
            new Color(193,231,227,255),//red -400
            new Color(220,255,251,255),//indigo - 300
            new Color(255,220,244,255),//LIGHT BLUE  - 300
            new Color(218,191,222,255),//GREEN  -400
            new Color(193,187,221,255),//YELLOW -300
        ]);
    
        

    

        ////////console.warn(this.colorPaletta);
        this._multipleRuleCheck();
        this.svg.innerHTML = "";
        const closest_left_el_middle = this._checkminustoswift();
        this._arrowInterpret();
        if(this._drawing_data.arrows.length != 0)
        {
            this.colorPalettaArrow = new ColorMap(this._drawing_data.arrows.filter(k=>k.parent_parent == true).length < 2 ? 2:(this._drawing_data.arrows.filter(k=>k.parent_parent == true).length+1), [
                new Color(213,0,0,255),
                new Color(100,221,23,255),
                new Color(255,214,0,255),
                new Color(0,0,255,255),
            ]);
        }
        //const lastParent =  branch.branch_parents.find(x => x._col == Math.max(... branch.branch_parents.map(object => object._col)));
        for (let index = 0; index < this.data.table.lastRow+1; index++) {
    
            var arr =  this._drawing_data.boxs.filter(x => x._row == index)
            
            for (let index2 = 0; index2 < arr.length; index2++) {

                    var el = arr[index2];

                    //////////////console.error(el);
                
                    this.svg.innerHTML += `
                        <g id="data_${el.Id}_g">
                            <rect id="data_${el.Id}_box" x="${el._middle-(this.boxSpec.width/2)}" y="${el._top}" rx="20" ry="20" width="${this.boxSpec.width}" height="${this.boxSpec.height}" style="
                                ${this._pick_color_box(index)}
                                stroke-width:2;
                            " />

                            <text id="data_${el.Id}_text" x="0" y="50" font-family="Verdana" font-size="20" fill="black">${el.Name}</text>
                        </g>
                    `

                    const text = document.querySelector(`#data_${el.Id}_text`);
                

                    var bbox = text.getBBox();
                    var width = bbox.width;
                    var height = bbox.height;


                    text.setAttribute("y",(((this.boxSpec.height-height)/2)+height-4)+ el._top);

                    text.setAttribute("x",((this.boxSpec.width-width)/2) + el._middle-(this.boxSpec.width/2));


                    //fitting text
                    const max_font_size = 20;
                    var font_size_Sayac = 20;
                    const svgns = "http://www.w3.org/2000/svg";

                    if(bbox.width > this.boxSpec.width)//text oversize
                    {
                        text.remove();
                        //////console.log(el.Name, "OverSize !!");
                        const strToArr= el.Name.split(" ")
                    

                        const maxLength_Word  = strToArr.sort(
                            function (a, b) {
                                return b.length - a.length;
                            }
                        )[0];

                        //To find font-size for the text

                        
                        var fonstSizeByWidth = 20;
                        

                        while(true) // tow row
                        {
                            if(this.protection.p2.max<this.protection.p2.now){ break;}else{this.protection.p2.now++}
                            
                            let newText = document.createElementNS(svgns, "text");
                            newText.setAttributeNS(null,"font-family", "Verdana");
                            newText.setAttributeNS(null,"font-size", fonstSizeByWidth);
                            newText.setAttributeNS(null,"fill", "black");
                            newText.innerHTML = maxLength_Word;
                            this.svg.appendChild(newText);
                            var newText_width = newText.getBBox().width;

                            ////////console.log(newText_width);

                            if(newText_width > this.boxSpec.width)
                            {
                                fonstSizeByWidth--;
                                newText.remove();
                            }
                            else{
                                newText.remove();
                                break;
                            }
                        }
                        //////console.log("En Büyük Parça:", maxLength_Word);
                        //////console.log("fonstSizeByWidth", fonstSizeByWidth);

                        

                        var text_rows = [];
                        var removed = [];
                        
                        while(true) // tow row
                        {
                            if(this.protection.p3.max<this.protection.p3.now){ break;}else{this.protection.p3.now++}

                    
                            var pieces = Array.from(el.Name.split(" "));
                                    pieces = pieces.filter(u=>removed.indexOf(u) == -1)
                            if(pieces.length == 0)
                            {
                                break;
                            }

                            while(true) // to col
                            {
                            
                                if(this.protection.p4.max<this.protection.p4.now){ break;}else{this.protection.p4.now++}

                                if(pieces.length != 1 )
                                {
                                    const test_edilecek = pieces.join(' ');
                                
                                    let newText = document.createElementNS(svgns, "text");
                                    newText.setAttributeNS(null,"font-family", "Verdana");
                                    newText.setAttributeNS(null,"font-size", fonstSizeByWidth);
                                    newText.setAttributeNS(null,"fill", "black");
                                    newText.setAttributeNS(null,"text-anchor", "middle");
                                    newText.innerHTML = test_edilecek;
                                    this.svg.appendChild(newText);
                                    var newText_width = newText.getBBox().width;

                                    //////console.log(newText_width);

                                    if(newText_width > this.boxSpec.width)
                                    {
                                        //removed.push();
                                        pieces.pop()
                                        newText.remove();
                                    }
                                    else{
                                        newText.remove();
                                        break;
                                    }
                                
                                }
                                else{
                                    break;
                                }
                            }
                            //////console.log("Son kalan: ", pieces.join(' '));
                            text_rows.push(pieces.join(' '))
                            removed = removed.concat(pieces);
                        }

                        //////console.log("text_rows", text_rows);



                        let netsSvg = document.createElementNS(svgns, "svg");
                        netsSvg.setAttributeNS(null,"width", this.boxSpec.width);
                        //netsSvg.setAttributeNS(null,"height", this.boxSpec.height);
                        netsSvg.setAttributeNS(null,"overflow", "visible");
                        netsSvg.setAttributeNS(null,"x", el._middle-(this.boxSpec.width/2));
                        netsSvg.setAttributeNS(null,"y", el._top+20);
                        
                        document.getElementById(`data_${el.Id}_g`).appendChild(netsSvg);

                        var newText_height = 0;
                        
                        var temp_newText_y = 0;
                        text_rows.forEach(trow => {
                            let newText = document.createElementNS(svgns, "text");
                                newText.setAttributeNS(null,"font-family", "Verdana");
                                newText.setAttributeNS(null,"font-size", fonstSizeByWidth);
                                newText.setAttributeNS(null,"fill", "black");
                                newText.setAttributeNS(null,"text-anchor", "middle");
                                newText.setAttributeNS(null,"x", (this.boxSpec.width/2));
                                newText.setAttributeNS(null,"y", temp_newText_y);
                                newText.innerHTML = trow;
                                netsSvg.appendChild(newText);
                                newText_height= newText.getBBox().height;
                                temp_newText_y += newText.getBBox().height;
                        });
                        
                        //////console.log(document.querySelector(`#data_${el.Id}_box`))
                        //////console.log(netsSvg);
                        //////console.warn((this.boxSpec.height-netsSvg.getBBox().height)/2);

                        while(netsSvg.getBBox().height > this.boxSpec.height)
                        {
                            if(this.protection.p5.max<this.protection.p5.now){ break;}else{this.protection.p5.now++}

                            temp_newText_y=0;
                            fonstSizeByWidth--;
                            netsSvg.childNodes.forEach(trow => {
                                //////console.log(trow);
                                trow.setAttributeNS(null,"font-size", fonstSizeByWidth);
                                trow.setAttributeNS(null,"y", temp_newText_y);
                                temp_newText_y += trow.getBBox().height;
                            });

                        
                        }
                        //////console.error(temp_newText_y);
                    
                        
                        netsSvg.setAttribute("y",(((this.boxSpec.height-netsSvg.getBBox().height)/2)+fonstSizeByWidth)+el._top);


                    }

            }
                
        }
        //////////////console.error(this.data.arrows);
        this._drawing_data.arrows.forEach(element => {
            this._crate_Arrow(element);
        });

        
        this.svgMain.setAttribute("viewBox",`-10 -10 ${this.svg.getBBox().width+20+closest_left_el_middle} ${this.svg.getBBox().height+20}`);


    
    }
    _checkminustoswift()
    {
        const closest_left_el = this._drawing_data.boxs.find(x => (x._middle) == Math.min(...this._drawing_data.boxs.map(object => (object._middle))));
        //////////////console.error(`En soldaki el ${closest_left_el._middle}`); //-this.boxSpec.middle
        if(closest_left_el._middle-this.boxSpec.middle < 0)
        {
            const tum_el_eklenecek = Math.abs(closest_left_el._middle-this.boxSpec.middle);
            this._drawing_data.boxs.forEach(x => {
                x._middle += tum_el_eklenecek;
            })
        }

        return closest_left_el._middle;

    }
    _arrowInterpret()
    {
        var cizilecekArrow = [];

        function groupBy(arr, criteria) {
            const newObj = arr.reduce(function (acc, currentValue) {
                if (!acc[currentValue[criteria]]) {
                acc[currentValue[criteria]] = [];
                }
                acc[currentValue[criteria]].push(currentValue);
                return acc;
            }, {});
            return newObj;
        }
        
        this._drawing_data.boxs.filter(x=>x.ParentId != null).forEach(element => {

            if(element.multiple == true)
            {
                const hesap = this.boxSpec.width/(element.multipleParent.length+1)
                element.multipleParent.forEach((c,ind) =>{
                
                    const parent_info = this._drawing_data.boxs.find(b => b.Id == c);
                    //////console.log("parent_info",parent_info);
                    //////console.log("c",c);
                    var parent_parent = false;
                    if(parent_info._row - element._row > 2)//if((element._top-20 - (parent_info._top+this.boxSpec.height)) > this.boxSpec.middle)
                    {
                        parent_parent = true;
                    }
                        /*fromRow:c._row,
                        from:c,*/

                        
                    
                    /*const howManyChildren_theParent_normal = this.data.boxs.filter(g => g.ParentId != null && g.multiple == false && g.ParentId.indexOf(parent_info.Id) != -1)
                    const howManyChildren_theParent_multi = this.data.boxs.filter(g => g.multiple == true && g.multipleParent.indexOf(parent_info.Id) != -1)
                    
                    //console.warn("parent_info", parent_info) 
                    //console.warn("howManyChildren_theParent_normal", howManyChildren_theParent_normal) 
                    //console.warn("howManyChildren_theParent_multi", howManyChildren_theParent_multi)      
                    //console.warn(groupBy(howManyChildren_theParent_normal,"ParentId"));
                    //console.warn(groupBy(howManyChildren_theParent_multi,"multipleParent"));
                    const toplam_grup = 
                    Object.keys(groupBy(howManyChildren_theParent_normal,"ParentId")).length
                    +Object.keys(groupBy(howManyChildren_theParent_multi,"multipleParent")).length;
                    //console.warn(toplam_grup);

                    const hesap2 = this.boxSpec.width/(toplam_grup+1)*/

                    var whichWay = 0;
                    if(parent_info._middle == element._middle){
                        whichWay = 0;
                    }
                    else if(parent_info._middle > element._middle){
                        whichWay = -20;
                    
                    }
                    else if(parent_info._middle < element._middle){
                        whichWay = 20;
                    
                    }

                    

                    cizilecekArrow.push({
                        to:element.Id,
                        toRow:element._row,
                    
                        _start:{
                            x:parent_info._middle+whichWay,
                            y:parent_info._top+this.boxSpec.height
                        },
                        _end:{
                            x:(element._middle - this.boxSpec.middle)+((ind+1)*hesap),
                            y:element._top-20 // arrow size
                        },
                        multiple:true,
                        multiple_counter:ind,
                        "parent_parent":parent_parent,
                        countOfParent:cizilecekArrow.filter(k=>k.to == element.Id).length,
                        countOfParent_parent:cizilecekArrow.filter(k=>k.to == element.Id && k.parent_parent == true).length
                    })
                
                })
            }
            else{

                element.ParentId.forEach((c,ind)=>{
                    const parent_info = this._drawing_data.boxs.find(b => b.Id == c);
                    //////console.log("parent_info",parent_info);
                    //////console.log("c",c);
                    var parent_parent = false;
                    if(parent_info._row - element._row > 2)//if((element._top-20 - (parent_info._top+this.boxSpec.height)) > this.boxSpec.middle)
                    {
                        parent_parent = true;
                    }
                        /*fromRow:c._row,
                        from:c,*/
                
                    cizilecekArrow.push({
                        to:element.Id,
                        toRow:element._row,
                    
                        _start:{
                            x:parent_info._middle,
                            y:parent_info._top+this.boxSpec.height
                        },
                        _end:{
                            x:element._middle,
                            y:element._top-20 // arrow size
                        },
                        multiple:false,
                        "parent_parent":parent_parent,
                        countOfParent:cizilecekArrow.filter(k=>k.to == element.Id).length,
                        countOfParent_parent:cizilecekArrow.filter(k=>k.to == element.Id && k.parent_parent == true).length
                    })
                })
            
            }
            
        
        });
        this._drawing_data.arrows = cizilecekArrow;
    }
    _crate_Arrow(info)
    {

        const position = {
            start:info._start,
            end:info._end
        }
    
        //////console.error("info",info);
        var _vertical_diveded_2 = (position.end.y - position.start.y) / 2;
        const _horizantal = position.end.x - position.start.x;

        var color_path = `#6d6d6d`;
        
        /*if(info.parent_parent == true)
        {
            ////////console.log("Üst parentı temsil ediyor")
            color_path = this._pick_color_arrow(this.multiParent_parent_ref_Sayac)
            this.multiParent_parent_ref_Sayac++;

            /*if(info.countOfParent_parent > 0){
                /Future
            }*/

        //}

        if(info.multiple == true)
        {
            _vertical_diveded_2 = (position.end.y - position.start.y) / 3

        }

        var _path = "";
        var _tri = "";

        if(Math.abs(position.start.x - position.start.x+_horizantal) < 40 )
        {
            _path = `
                M${position.start.x} ${position.start.y}
                V${position.start.y+_vertical_diveded_2}
                H${position.start.x+_horizantal}
                V${position.end.y}
            `;

            _tri=`
            M ${position.start.x+_horizantal-10} ${position.end.y} 
            L ${position.start.x+_horizantal+10} ${position.end.y} 
            L ${position.start.x+_horizantal} ${position.end.y+20} 
            Z`;
        }
        else if(position.start.x  < (position.start.x+_horizantal)){

            _path = `
                M${position.start.x} ${position.start.y}
                V${position.start.y+_vertical_diveded_2-20}
                a20,20 0 0 0 20,20
                H${position.start.x+_horizantal-20}
                a20,20 0 0 1 20,20
                V${position.end.y}
                
            `;
            _tri=`
                M ${position.start.x+_horizantal-10} ${position.end.y} 
                L ${position.start.x+_horizantal+10} ${position.end.y} 
                L ${position.start.x+_horizantal} ${position.end.y+20} 
                Z
            `;
        
        }
        else if(position.start.x  > (position.start.x+_horizantal)){

            _path = `
                M${position.start.x} ${position.start.y}
                V${position.start.y+_vertical_diveded_2-20}
                a20,20 0 0 1 -20,20
                H${position.start.x+_horizantal+20}
                a20,20 0 0 0 -20,20
                V${position.end.y}
            `;
            _tri=`
                M ${position.start.x+_horizantal-10} ${position.end.y} 
                L ${position.start.x+_horizantal+10} ${position.end.y} 
                L ${position.start.x+_horizantal} ${position.end.y+20} 
                Z
            `;
        
        }
    
        //////////////console.error(_path)
        this.svg.innerHTML += `
            <path id="lineAB" d="${_path}" stroke="${color_path}"
        stroke-width="3" fill="none" />
        `
        this.svg.innerHTML += `
            <path d="${_tri}"
                    fill="black" stroke="#6d6d6d" stroke-width="0" />
        `
    }
    _pick_color_box(row)
    {
        //////////console.log(colorPalette.map.length);
        var colar_select = this.colorPaletta.map[row];
        var ob =`
                fill:	rgba(${colar_select.r},${colar_select.g},${colar_select.b},${colar_select.a});
                stroke:	rgba(117,117,117,120);
            `
        return ob;
        
    
    
    }

    /*_pick_color_arrow(count)
    {

        var colar_select =  this.colorPalettaArrow.map[count];
        var ob =`rgba(${colar_select.r},${colar_select.g},${colar_select.b},${colar_select.a})`
        return ob;
    
    }*/

    _multipleRuleCheck()
    {
        this._drawing_data.boxs.filter(c => c.multiple == true).forEach((b,ind) =>{
        
        //rule 1 if it can be move center, move
            
            const parents =  this._drawing_data.boxs.filter(n => b.multipleParent.indexOf(n.Id) != -1);
            const firstParent2 = parents.find(x => x._middle == Math.min(... parents.map(object => object._middle)));
            const lastParent2 =  parents.find(x => x._middle == Math.max(... parents.map(object => object._middle)));
            const parentsRealMiddle2 = (lastParent2._middle - firstParent2._middle)/2 + firstParent2._middle;

            const padding = 5;
            const minVal = (parentsRealMiddle2 - this.boxSpec.width - padding);
            //console.log(parentsRealMiddle2);
            const maxVal =(parentsRealMiddle2 + this.boxSpec.width + padding);



            const children =  this._drawing_data.boxs.filter(n => n.ParentId != null && n.ParentId.indexOf(b.Id) != -1);
            if(children.length>0){
                var childrenIds = children.map(v=>v.Id);
            
                var firstchildren = children.find(x => x._middle == Math.min(... children.map(object => object._middle)));
                var lastchildren=  children.find(x => x._middle == Math.max(... children.map(object => object._middle)));

                //Eger Cocukari tasirsam
                var kaydırmaMes =  parentsRealMiddle2 - b._middle;
                //


                const padding2 = 5;
                var minVal2 = (kaydırmaMes+firstchildren._middle - this.boxSpec.width - padding);
                //console.log(parentsRealMiddle2);
                var maxVal2 =(kaydırmaMes+lastchildren._middle + this.boxSpec.width + padding);

            
            }
            

            const cakisan =  this._drawing_data.boxs.filter(
                k=> ( k._middle > minVal && k._middle < maxVal)
                && k._row == b._row
                && k.Id != b.Id);

            if(cakisan.length > 0)
            {
            
            }
            else{
                b._middle = parentsRealMiddle2;

                if(children.length>0){
                    const cakisan2 =  this._drawing_data.boxs.filter(
                    k=> ( k._middle > minVal2 && k._middle < maxVal2)
                    && k._row == firstchildren._row
                    && childrenIds.indexOf(k.Id) == -1);

                        //console.log(cakisan);
                    if(cakisan.length > 0)
                    {
                        console.log("Çocukları taşıma");
                    }
                    else{
                        children.forEach(t=>{
                        
                            t._middle += kaydırmaMes;
                        })
                    }
                }
            }

            
        
        })
    }
}