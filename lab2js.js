"use strict";
function Triangle(sideC, angleA, angleB) {
	this.sideC = sideC === undefined ? 0.0 : sideC;
	this.angleA = angleA === undefined ? 0.0 : angleA;
	this.angleB = angleB === undefined ? 0.0 : angleB;
	
	this.angleC = function ()
	{ 
		return 180 - this.angleA - this.angleB;
	};
	
	this.angleToRad = function(angle)
	{
		return angle*3.141592/180;
	};
	this.sideA = function ()
	{
		var angA = this.angleToRad(this.angleA);
		var angC = this.angleToRad(this.angleC());
		return (Math.sin(angA)/Math.sin(angC)) * this.sideC;
	};
	this.sideB = function ()
	{
		var angB = this.angleToRad(this.angleB);
		var angC = this.angleToRad(this.angleC());
		return (Math.sin(angB)/Math.sin(angC)) * this.sideC;
	};
	this.medianA = function ()
	{
		return 0.5*Math.sqrt(2*this.sideC*this.sideC + 2 *this.sideB()*this.sideB() - this.sideA()*this.sideA());
	}
	this.medianB = function ()
	{
		return 0.5*Math.sqrt(2*this.sideC*this.sideC + 2 *this.sideA()*this.sideA() - this.sideB()*this.sideB());
	}
	this.medianC = function ()
	{
		return 0.5*Math.sqrt(2*this.sideA()*this.sideA() + 2 *this.sideB()*this.sideB() - this.sideC*this.sideC);
	}
}
function TriangleView (a, b, c) {
	Triangle.call(this, a, b, c);

	this.createOperationView = function(rowIndex) {
		var view = document.createDocumentFragment();
		
		var deleteButton = document.createElement("button");
		var setButton = document.createElement("button");
		var valInput = document.createElement("input");
		
		
		deleteButton.appendChild(document.createTextNode("Delete"));
		setButton.appendChild(document.createTextNode("Set Base"));
		valInput.type = "number";
		valInput.id = "setVal" + rowIndex.toString();
		
		deleteButton.addEventListener("click", function() {
			data.deleteTriangle(rowIndex);
		});
		setButton.addEventListener("click", function() {
			data.setSide(rowIndex);
		});
		
		view.appendChild(deleteButton);
		view.appendChild(setButton);
		view.appendChild(valInput);
		return view;
	}
	
	this.createRow = function (rowIndex) {
	    var tr = document.createElement('tr');
	    tr.id = "row_" + rowIndex;

	    var td1 = document.createElement('td');
	    td1.appendChild(document.createTextNode('#' + rowIndex));
		td1.id = "enum";
		tr.appendChild(td1);

	    var td2 = document.createElement('td');
	    td2.appendChild(document.createTextNode(this.sideC));
	    tr.appendChild(td2);
	    
	    var td3 = document.createElement('td');
	    td3.appendChild(document.createTextNode(this.angleA));
		tr.appendChild(td3);

		var td4 = document.createElement('td');
	    td4.appendChild(document.createTextNode(this.angleB));
		tr.appendChild(td4);

		var td6 = document.createElement('td');
	    td6.appendChild(document.createTextNode(this.sideA()));
		tr.appendChild(td6);
		
		var td7 = document.createElement('td');
	    td7.appendChild(document.createTextNode(this.sideB()));
		tr.appendChild(td7);
		
		var td8 = document.createElement('td');
	    td8.appendChild(document.createTextNode(this.angleC()));
		tr.appendChild(td8);
		
		var td9 = document.createElement('td');
	    td9.appendChild(document.createTextNode(this.medianA()));
		tr.appendChild(td9);
		
		var td10 = document.createElement('td');
	    td10.appendChild(document.createTextNode(this.medianB()));
		tr.appendChild(td10);
		
		var td11 = document.createElement('td');
	    td11.appendChild(document.createTextNode(this.medianC()));
		tr.appendChild(td11);
		
		var td12 = document.createElement('td');
	    td12.appendChild(this.createOperationView(rowIndex));
		tr.appendChild(td12);

		return tr;
	}

}

function getRandom () {
	return Math.round(Math.random()*100)+1;
}

var data = {
	triangles : [
		new TriangleView(10,30,60),
		new TriangleView(25,45,60),
		new TriangleView(20,60,60)
	],
	

	refreshTable : function () {
		var tableBody = document.getElementById('triangles');
		tableBody.innerHTML = '';
		for(var i = 0; i < this.triangles.length; ++i) {
			tableBody.appendChild(this.triangles[i].createRow(i));
		}
	},

	add : function (sideC, angleA, angleB) {
		this.triangles.push(new TriangleView(sideC, angleA, angleB));
		this.refreshTable();
	},
	
	addCustom : function () {
		var sC = parseInt(document.getElementById('custBase').value);
		var angA = parseInt(document.getElementById('custAngA').value);
		var angB = parseInt(document.getElementById('custAngB').value);
		if(sC>0&&angA>0&&angB>0&&angA+angB<180)
			this.add(sC, angA, angB);
	},
	addRandom : function () {
		var angA = Math.round(Math.random()*90)+1;
		var angB = Math.round(Math.random()*89)+1;
		this.add(getRandom(), angA, angB);
	},

	deleteTriangle : function (index) {
		this.triangles.splice(index, 1);
		this.refreshTable();
	},
	setSide: function(index){
		if(index>-1 && index<this.triangles.length)
		{
			this.triangles[index].sideC *= parseFloat(document.getElementById("setVal"+index.toString()).value);

			this.refreshTable();
		}
	},
	similarityCheck : function () {
		var ind1 = parseInt(document.getElementById('comp1').value);
		var ind2 = parseInt(document.getElementById('comp2').value);
		if(ind1<0 || ind1>=this.triangles.length||ind2<0 || ind2>=this.triangles.length||ind1===undefined||ind2===undefined)
		{
			document.getElementById('compRes').value = "Invalid index";
			return 0;
		}
		var min1 = this.triangles[ind1].angleA;
		var max1 = min1;
		var min2 = this.triangles[ind2].angleA;
		var max2 = min2;
		if(this.triangles[ind1].angleB < min1) min1 = this.triangles[ind1].angleB;
		if(this.triangles[ind1].angleC() < min1) min1 = this.triangles[ind1].angleC();
		if(this.triangles[ind2].angleB < min2) min2 = this.triangles[ind2].angleB;
		if(this.triangles[ind2].angleC() < min2) min2 = this.triangles[ind2].angleC();
		if(this.triangles[ind1].angleB > max1) max1 = this.triangles[ind1].angleB;
		if(this.triangles[ind1].angleC() > max1) max1 = this.triangles[ind1].angleC();
		if(this.triangles[ind2].angleB > max2) max2 = this.triangles[ind2].angleB;
		if(this.triangles[ind2].angleC() > max2) max2 = this.triangles[ind2].angleC();
		if(min1===min2 && max1===max2)
			document.getElementById('compRes').value = "Triangles are similar";
		else
			document.getElementById('compRes').value = "Triangles are not similar";
	},
	clear : function () {
		this.triangles = [];
		this.refreshTable();
	}
}
