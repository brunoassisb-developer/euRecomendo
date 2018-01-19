sap.ui.define([
					"com/sap/euRecomendo/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/model/Filter",
					"sap/ui/model/FilterOperator",
					"sap/m/MessageBox",
					"sap/m/MessageToast",
					"sap/ui/Device",
				], function (
					BaseController, 
					JSONModel, 
					Filter, 
					FilterOperator, 
					MessageBox,
					MessageToast,
					Device) {
	
		"use strict";

		return BaseController.extend("com.sap.euRecomendo.controller.Main", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay;

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					busy : true,
					info : {}
				});
				
				this.setModel(oViewModel, "worklistView");
				
		        this.getOwnerComponent().getModel().metadataLoaded().then(function () {
		            // Restore original busy indicator delay for the worklist view
		            oViewModel.setProperty("/delay", iOriginalBusyDelay);
		          }
		        );
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			/**
			 * @public
			 */
			onPress: function(oEvent){
				
			},

			/**
			 * @public
			 */			
			onSearch: function(oEvent){
				
				/*var oTableSearchfield = [];
				
				var sSearchValue = oEvent.getParameter("query");
				
				
				if(oEvent.oSource.getId().indexOf("Pendente") !== -1){
					var oList = this.byId("tablePendentes");
					oTableSearchfield.push(new Filter("StConf", FilterOperator.EQ, "P"));
				}
				
				if(oEvent.oSource.getId().indexOf("Recusado") !== -1){
					var oList = this.byId("tableRecusados");
					oTableSearchfield.push(new Filter("StConf", FilterOperator.EQ, "R"));
				}
				
				if(oEvent.oSource.getId().indexOf("Historico") !== -1){
					var oList = this.byId("tableHistorico");
					oTableSearchfield.push(new Filter("IntervalDate", FilterOperator.EQ, "0"));
				}
				
				if (!!sSearchValue) {
					oTableSearchfield.push(new Filter("Vbeln", FilterOperator.EQ, sSearchValue));
				}
				
				oList.getBinding("items").filter(oTableSearchfield, "Application");*/
			},
				
			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */
			/**
			  * @private
			  */
			_clearFilters: function(){
				this.byId("searchPendente").setValue("");
				this.byId("searchRecusado").setValue("");
				this.byId("searchHistorico").setValue("");
			}
			
		});
	}
);