module.exports = `{{#cards}}
<div class="{{#format.ibm-col-normal}}{{.}}{{/format.ibm-col-normal}}{{^format.ibm-col-normal}}ibm-col-4-1{{/format.ibm-col-normal}} {{#format.ibm-col-mobile}}{{.}}{{/format.ibm-col-mobile}}{{^format.ibm-col-mobile}}ibm-col-medium-4-2{{/format.ibm-col-mobile}}">
  <div class="ibm-card ibm-card--noborder">
    
    {{#imageUrl}}
    <div class="ibm-card__image">
      <img src="{{imageUrl}}" style="width:100%" {{#imageAlt}}alt="{{.}}"{{/imageAlt}}{{^imageAlt}}alt="Card image alternate text missing"{{/imageAlt}} class="">
    </div>
    {{/imageUrl}}

    <div class="ibm-card__content" style="padding:10px 10px 10px 0;">
      <h3 class="ibm-h4 ibm-bold">{{title}}</h3>
      {{#description}}
      <p>{{{.}}}</p>
      {{/description}}

    {{#link1Text}}{{#link1Url}}

    {{#format.ibm-card-bottom}}
    </div>
    <div class="ibm-card__bottom" style="padding: 20px 0 20px 0">
    {{/format.ibm-card-bottom}}

      <p class="ibm-padding-top-1">        
        <a href="{{link1Url}}" {{#link1Target}}target="{{link1Target}}"{{/link1Target}}{{^link1Target}}target="_blank"{{/link1Target}} class="ibv-card-link ibm-forward-link ibm-inlinelink ibm-icon-after">{{link1Text}}</a>
        {{#link2Text}}{{#link2Url}}       
      </p>    
	  <p>
	    <a href="{{link2Url}}" {{#link2Target}}target="{{link2Target}}"{{/link2Target}}{{^link2Target}}target="_blank"{{/link2Target}} class="ibv-card-link ibm-forward-link ibm-inlinelink ibm-icon-after">{{link2Text}}</a>     
        {{/link2Url}}{{/link2Text}}
	  </p>

    {{/link1Url}}{{/link1Text}}
    </div>    
  </div>
</div>
{{/cards}}
{{^cards}}
<p>NO CARDS</p>
{{/cards}}`;
