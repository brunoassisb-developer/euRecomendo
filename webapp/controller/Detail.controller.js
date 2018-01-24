/*global location */
sap.ui.define([
					"com/sap/euRecomendo/controller/BaseController",
					"sap/suite/ui/commons/util/DateUtils",
					"sap/ui/model/json/JSONModel",
					"sap/ui/core/routing/History",
					"sap/m/MessageBox",
					"sap/m/MessageToast"
	], function (	
					BaseController, 
					DateUtils,
					JSONModel, 
					History, 
					MessageBox, 
					MessageToast) {
		
		"use strict";

		return BaseController.extend("com.sap.euRecomendo.controller.Detail", {
		
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});
				
				this.getRouter().getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "detailView");
			},
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			/**
			 * @public
			 */			
			onNavBack : function() {
		    	 var sPreviousHash = History.getInstance().getPreviousHash();
		    	 
		    	 var oTimeLine = this.byId("idTimeline");
				 oTimeLine.exit();

		         if (sPreviousHash !== undefined) {
		           history.go(-1);
		         } else {
		           this.getRouter().navTo("detail", {}, true);
		         }
		     },			
			 
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */
			/**
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sId =  oEvent.getParameter("arguments").sId;
				this._bindView(sId);
			},
			/**
			 * @private
			 */
			_bindView : function (sId) {
				//Set Image User
				var oGlobalModel = sap.ui.getCore().getModel("globalData"),
				sImgUser = oGlobalModel.getProperty("/img");
				this.byId("logonDetailButton").setIcon(sImgUser);
				
				var oGlobalView = this.getModel("initData"),
					oViewModel = this.getModel("detailView");
					
				oViewModel.setProperty("/busy", true);
				
				//Set Tiles
				var oData = oGlobalView.getProperty("/tiles");
				
				//Filtra Apps por categoria
				var oItem = oData.filter(function(item) { 
						return item._id == sId;
					});	
				oViewModel.setProperty("/info", oItem[0]);
				
				//Set Recomendações
				var oRecommends = oGlobalView.getProperty("/recommends");
				var oItems = [];
				oRecommends.forEach(function(oItem) {
					oItem.hireDate =  new Date().getTime();
					oItems.push(oItem);
				});
				oViewModel.setProperty("/recommends", oItems);
				
				oViewModel.setProperty("/busy", false);
			}
		

		});
	}
);