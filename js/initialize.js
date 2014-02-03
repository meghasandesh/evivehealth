var optionsHandler = {
	
	campaignOptions: null, // contains the order and value of the selected options
	
	selectedOption: null, // contains the selected value for the current option. e.g - blue ribbon recipe
	
	optionName: null, //contains the name of the current option. e.g - recipe, limited_edition
	
	creditsRemaining: 100,
	
	optionCount: 0,
	
	initialize: function() {
		$('#options').hide();
		$('figure a').on('mousedown', optionsHandler.loadOptions);
		$('#saveBtn').on('mousedown', optionsHandler.saveAndGoBack);
		$('#backBtn').on('mousedown', optionsHandler.goBack);
		$('.credRemaining span').html(optionsHandler.creditsRemaining);
	},
	
	updateDisplay: function() {
		$('.credRemaining span').html(optionsHandler.creditsRemaining);
		var displayParam = optionsHandler.optionCount >= 3 ? 'block' : 'none';
		$('#launchButton').css('display', displayParam);
	},
	
	loadOptions: function(e) {
		
		var id = $(this).attr('data-id');
		optionsHandler.optionName = id;
		$('#campaign').hide('slow');
		$('body').attr('id','campaignOptions');
		optionsHandler.constructOptions.call(this, id);
		$('#options').slideUp('slow');
		$('#options').show();
		$('#optionTitle').html($('figcaption',this).html());
	},
	
	constructOptions: function(id) {
		var img, option;
		for(var i=0; i < dataModel[id].options.length; i++) {
			var optionCredit = $('<span/>').attr('class','optionCredit').append(dataModel[id].options[i].credits +' c');
			var optionText = $('<span/>').attr('class','optionText').append(dataModel[id].options[i].value);
			img = '<img class="radio" src="images/1X1.png">';
			option = $('<li/>');
			if(optionsHandler.campaignOptions && optionsHandler.campaignOptions[id] && optionsHandler.campaignOptions[id].text == dataModel[id].options[i].value) {
				option.addClass('radioSelected');
				optionsHandler.selectedOption = option;
			}
			option.append(img)
					 .append(optionText)
					 .append(optionCredit)
					 .on('mousedown', optionsHandler.clickHandler);
			$('#optionsList').append(option);
		}
		
	},
	
	clickHandler: function() {
		$(optionsHandler.selectedOption).removeClass('radioSelected');
		optionsHandler.selectedOption = this;
		$(this).addClass('radioSelected');
	},
	
	saveAndGoBack: function() {
		if(optionsHandler.saveParameters() == 1) {
			$('#error').show();
		}
		else {
			optionsHandler.backHandler();
		}
	},
	
	saveParameters: function() {
		var difference, text, credit, creditTotal, newProperty = false;
		if(optionsHandler.selectedOption) {
			if(!optionsHandler.campaignOptions) {
				optionsHandler.campaignOptions = new Object();
			}
			text = $('.optionText',optionsHandler.selectedOption).html();
			credit = $('.optionCredit',optionsHandler.selectedOption).html().replace(' c','');
			if(optionsHandler.campaignOptions[optionsHandler.optionName]) {
				difference = credit - optionsHandler.campaignOptions[optionsHandler.optionName].credit;
			}
			else {
				difference = credit;
				newProperty = true;
			}
			creditTotal = 0;
			for(var obj in optionsHandler.campaignOptions) {
				creditTotal += optionsHandler.campaignOptions[obj].credit*1;
			}
			creditTotal += difference*1;
			if(creditTotal < 100) {			
				optionsHandler.campaignOptions[optionsHandler.optionName] = {text: text, credit: credit};
				optionsHandler.creditsRemaining = 100 - creditTotal;
				optionsHandler.optionCount += newProperty ? 1: 0;
			}
			else {
				return 1;
			}
		}
		
		return 0;
	},
	
	clearParams: function() {
		optionsHandler.optionName = null;
		optionsHandler.selectedOption = null;
	},
	
	goBack: function() {
		optionsHandler.clearParams();
		optionsHandler.backHandler();
	},
	
	backHandler: function() {
		$('body').attr('id','campaignPlan');
		$('#options').hide('slow');
		$('#campaign').slideDown("slow");
		$('#campaign').show();
		$('#optionsList').empty();
		optionsHandler.updateDisplay();
	},
	
	aggregator: function() {
	var dataAggregator;
		if(!localStorage.getItem('dataAggregator')) {
			dataAggregator = new Object();
			//dataAggregator[] = {optionName: };
		}
	}
};

$(document).ready(optionsHandler.initialize);

