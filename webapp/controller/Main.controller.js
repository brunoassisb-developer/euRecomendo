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
			
			/**
			 * @public
			 */	
			onFilterReset: function(oEvent){
				this.byId("searchTileName").setValue("");
				this.byId("searchTileCategory").setValue("");
				this.byId("searchTileProvince").setValue("");
				this.byId("searchTileCity").setValue("");
			},

			/**
			 * @public
			 */				
			onLogon: function(oEvent){
				//Abre Tela de Logon
	            if (! this._oDialogLogon) {
	               var oView = this.getView();
	               this._oDialogLogon = sap.ui.xmlfragment(oView.getId(),"com.sap.euRecomendo.view.fragments.logon", this);
	            }

	            this.getView().addDependent(this._oDialogLogon);
	            
	            // toggle compact style
	            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogLogon);
	            this._oDialogLogon.open();	
			},
			
			/**
			 * @public
			 */				
			onLogonConfirm: function(oEvent){
				var sUser = this.byId("inputUser").getValue(),
					sPasswrd = this.byId("inputPassword").getValue();
					
				if(!sUser || !sPasswrd){
					MessageBox.error(this.getResourceBundle().getText("msgErrorFillAllFields"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				//Set User information as Global Model
				var oUser = {
								user: sUser,
								img: "img/user.jpg"
							};
				
				var oGlobalModel = new sap.ui.model.json.JSONModel(oUser);
  					sap.ui.getCore().setModel(oGlobalModel, "globalData");
				
				//Set Foto User Main View
				this.byId("logonButton").setIcon(oUser.img);
				this.onLogonClose();
			},

			/**
			 * @public
			 */				
			onLogonClose: function(oEvent){
				this._oDialogLogon.destroy();
				this._oDialogLogon = null;
			},

			/**
			 * @public
			 */				
			onNewUser: function(oEvent){
				
				this.onLogonClose();
				
				//Abre Tela de Novo Usuário
	            if (! this._oDialogNewUser) {
	               var oView = this.getView();
	               this._oDialogNewUser = sap.ui.xmlfragment(oView.getId(),"com.sap.euRecomendo.view.fragments.newUser", this);
	            }

	            this.getView().addDependent(this._oDialogNewUser);
	            
	            // toggle compact style
	            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogNewUser);
	            this._oDialogNewUser.open();	
			},

			/**
			 * @public
			 */				
			onNewUserClose: function(oEvent){
				this._oDialogNewUser.destroy();
				this._oDialogNewUser = null;
			},

			/**
			 * @public
			 */				
			onNewUserConfirm: function(oEvent){
				
				var sUser = this.byId("inputNewUser").getValue(),
					sPasswrd = this.byId("inputNewPassword").getValue(),
					sConfPasswrd = this.byId("inputConfirmNewPassword").getValue();
					
				if(!sUser || !sPasswrd || !sConfPasswrd){
					MessageBox.error(this.getResourceBundle().getText("msgErrorFillAllFields"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				if(sPasswrd !== sConfPasswrd){
					MessageBox.error(this.getResourceBundle().getText("msgErrorPasswdConfPwsd"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				//Set User information as Global Model
				var oUser = {
								user: sUser,
								img: "img/user.jpg"
							};
				
				var oGlobalModel = new sap.ui.model.json.JSONModel(oUser);
  					sap.ui.getCore().setModel(oGlobalModel, "globalData");
				
				//Set Foto User Main View
				this.byId("logonButton").setIcon(oUser.img);
				this.onNewUserClose();	
			},
			
			/**
			 * @public
			 */	
			onTilePress: function(oEvent){
				 var oModel = sap.ui.getCore().getModel("globalData");
		         if(!oModel){
					MessageBox.error(this.getResourceBundle().getText("msgErrorUserNoAuthen"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				var oItem = oModel.getData();
				if(!oItem.user){
					MessageBox.error(this.getResourceBundle().getText("msgErrorUserNoAuthen"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				var oTile = oEvent.getSource(),
			    sId = oTile.getTooltip();
				
				this.getRouter().navTo("detail", {
					sId : sId
				});
			},
		
			/**
			 * @public
			 */				
			onCreate: function(oEvent){
				 var oModel = sap.ui.getCore().getModel("globalData");
		         if(!oModel){
					MessageBox.error(this.getResourceBundle().getText("msgErrorUserNoAuthen"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				var oItem = oModel.getData();
				if(!oItem.user){
					MessageBox.error(this.getResourceBundle().getText("msgErrorUserNoAuthen"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				//Abre Tela de Novo Tile
	            if (! this._oDialogNewTile) {
	               var oView = this.getView();
	               this._oDialogNewTile = sap.ui.xmlfragment(oView.getId(),"com.sap.euRecomendo.view.fragments.newTile", this);
	            }

	            this.getView().addDependent(this._oDialogNewTile);
	            
	            // toggle compact style
	            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogNewTile);
	            this._oDialogNewTile.open();
				
			},
			
			/**
			 * @public
			 */	
			onNewTileClose: function(oEvent){
				this._oDialogNewTile.destroy();
				this._oDialogNewTile = null;
			},
			
			/**
			 * @public
			 */	
			onNewTileConfirm: function(oEvent){
				
			
				
				var sEstabelecimento = this.byId("inputNewTileEstabelecimento").getValue(),
					sProvince = this.byId("inputNewTileProvince").getValue(),
					sCity = this.byId("inputNewTileCity").getValue();
					
				if(!sEstabelecimento || !sProvince || !sCity){
					MessageBox.error(this.getResourceBundle().getText("msgErrorFillAllFields"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
					return;
				}
				
				this.onNewTileClose();
				MessageBox.success(this.getResourceBundle().getText("msgSuccessCreateEstabelecimento"), 
					                  { styleClass: this.getOwnerComponent().getContentDensityClass() }
					         );
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
					
				var sLikes = 1000;
					
				oViewModel.setProperty("/busy", true);
				
				//Set Tiles
				var oData = oGlobalView.getProperty("/tiles");
				oData.forEach(function(oItem) {
					sLikes -= 105;
					oItem.likes = sLikes;
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