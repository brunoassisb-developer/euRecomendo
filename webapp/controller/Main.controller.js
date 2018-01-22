sap.ui.define([
					"com/sap/euRecomendo/controller/BaseController",
					"sap/ui/model/json/JSONModel",
					"sap/ui/model/Filter",
					"sap/ui/model/FilterOperator",
					"sap/m/MessageBox",
					"sap/m/MessageToast"
				], function (
					BaseController, 
					JSONModel, 
					Filter, 
					FilterOperator, 
					MessageBox,
					MessageToast) {
	
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
					delay: 0,
					info : {}
				});
				
				this.setModel(oViewModel, "mainView");
				
		        this.getOwnerComponent().getModel().metadataLoaded().then(function () {
		            // Restore original busy indicator delay for the worklist view
		            oViewModel.setProperty("/delay", iOriginalBusyDelay);
		          }
		        );
			},

			/**
			 * @public
			 */
			onAfterRendering: function(){
			    this._setTiles();
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
			onFilter: function(oEvent){
				//Abre Tela de Filtro
	            if (! this._oDialogFilterTiles) {
	               var oView = this.getView();
	               this._oDialogFilterTiles = sap.ui.xmlfragment(oView.getId(),"com.sap.euRecomendo.view.fragments.filter", this);
	            }

	            this.getView().addDependent(this._oDialogFilterTiles);
	            
	            // toggle compact style
	            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilterTiles);
	            this._oDialogFilterTiles.open();
			},

			/**
			 * @public
			 */			
			onFilterYes: function(oEvent){
				
				var oTableSearchfield = [],
					oInput;
				
				oInput = this.byId("searchTileName").getValue();
				oTableSearchfield.push(new Filter("header", FilterOperator.Contains, oInput));
				
				oInput = this.byId("searchTileCategory").getValue();
				oTableSearchfield.push(new Filter("category", FilterOperator.Contains, oInput));
				
				oInput = this.byId("searchTileProvince").getValue();
				oTableSearchfield.push(new Filter("province", FilterOperator.Contains, oInput));
				
				oInput = this.byId("searchTileCity").getValue();
				oTableSearchfield.push(new Filter("city", FilterOperator.Contains, oInput));
				
				var oList = this.byId("itemsTiles");
				oList.getBinding("content").filter(oTableSearchfield, "Application");
				
				this._oDialogFilterTiles.close();
				
			},

			/**
			 * @public
			 */				
			onFilterNo: function(oEvent){
				this._oDialogFilterTiles.close();
			},
			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */
			/**
			  * Distribui Tiles na tela principal
			  * @private
			  */
			_setTiles: function(){
				var oGlobalView = this.getModel("initData"),
					oViewModel = this.getModel("mainView"),
					oItems = [];
					
				oViewModel.setProperty("/busy", true);
				
				//Set Tiles
				var oData = oGlobalView.getProperty("/tiles");
				oData.forEach(function(oItem) {
					oItem.likes = '100';
					oItems.push(oItem);
				}, this);
				
				oViewModel.setProperty("/tiles", oItems);
				
				//Set Categorias
				oData = oGlobalView.getProperty("/category");
				oViewModel.setProperty("/category", oData);
				
				//Set Bairro
				oData = oGlobalView.getProperty("/province");
				oViewModel.setProperty("/province", oData);
				
				//Set Cidade
				oData = oGlobalView.getProperty("/city");
				oViewModel.setProperty("/city", oData);
				
				oViewModel.setProperty("/busy", false);
			}
			
		});
	}
);