

export default async function executeActions(actions, context) {
	//let page = context.page;
	//console.log("actions", actions);
  for(var i = 0; i < actions.length; i++){
	let action = actions[i];
	//console.log("action", action);
	await executeAction(action, context);
    //await page.waitForTimeout(3000);	
  }		
	
}


async function executeAction(action, context) {
  let actionName = action?.name || "";
  let config = action?.config || {};
  if(actionName == ""){
	return;
  }
  //console.log("actionName", actionName);
  
  switch (actionName) {
	case 'goto':
	  await executeGotoAction(config, context); 
	  break;
	case 'fill':
	  await executeFillAction(config, context); 
	  break;
	case 'click':
	  await executeClickAction(config, context); 
	  break;
	case 'waitFor':
	  await executeWaitForAction(config, context); 
	  break;
	//case 'evaluate':
	//  await executeEvaluateAction(config, context); 
	//  break;
	case 'dblclick':
	  await executeDblclickAction(config, context); 
	  break;
	case 'clear':
	  await executeClearAction(config, context); 
	  break;
	case 'check':
	  await executeCheckAction(config, context); 
	  break;
	case 'uncheck':
	  await executeUncheckAction(config, context); 
	  break;
	case 'selectOption':
	  await executeSelectOptionAction(config, context); 
	  break;
	case 'waitForTimeout':
	  await executeWaitForTimeoutAction(config, context); 
	  break;	  
	default:
		//
  }
 
  /*
  
  if(name == "goto"){
	await executeGotoAction(config, page); 
  }else if(name == "fill"){
	  
  }else if(name == "click"){
	  
  }else if(name == "waitFor"){
	  
  }else if(name == "evaluate"){
	  
  }else if(name == "dblclick"){
	  
  }else if(name == "clear"){
	  
  }else if(name == "check"){
	  
  }else if(name == "uncheck"){
	  
  }else if(name == "selectOption"){
	  
  }
  */
	
}


async function executeGotoAction(config, context) {
  //console.log("executeGotoAction",config);		
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let url = config.url || "";
  if(url == ""){
	  return;
  }
  await page.goto(url);
  //await page.waitForTimeout(3000);
}

async function executeFillAction(config, context) {
   //console.log("executeFillAction",config);
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  let value = config.value || "";
  if(selector == "" || value == ""){
	  return;
  }
  
  await page.locator(selector).first().fill(value);
  
  //await page.waitForTimeout(3000);
}

async function executeClickAction(config, context) {
  //console.log("executeClickAction",config);	
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  if(selector == ""){
	  return;
  }
  
  await page.locator(selector).first().click();
  //await page.waitForTimeout(3000);
}


async function executeWaitForAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  let timeout = parseInt(config.timeout) || 0;
  if(selector == "" || timeout == 0){
	  return;
  }
  
  await page.locator(selector).first().waitFor({timeout:timeout});
}

//这个动作有用么？怎么用？暂时先不加
/*
async function executeEvaluateAction(config, context) {
  let code = config.code || "";
  if(code == ""){
	  return;
  }
  
  await page.evaluate(code);
}
*/


async function executeDblclickAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  if(selector == ""){
	  return;
  }
  
  await page.locator(selector).first().dblclick();
}

async function executeClearAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  if(selector == ""){
	  return;
  }
  
  await page.locator(selector).first().clear();
}

async function executeCheckAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  if(selector == ""){
	  return;
  }
  
  await page.locator(selector).first().check();
}

async function executeUncheckAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  if(selector == ""){
	  return;
  }
  
  await page.locator(selector).first().uncheck();
}

async function executeSelectOptionAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }	
  let selector = config.selector || "";
  let value = config.value || "";
  if(selector == "" || value == ""){  
	  return;
  }
  
  await page.locator(selector).first().selectOption(value);
}

async function executeWaitForTimeoutAction(config, context) {
  let page = context.page || null;
  if(page == null){
	  return;
  }
  let timeout = parseInt(config.timeout) || 0;
  if(timeout == 0){  
	  return;
  }
  
  await page.waitForTimeout(timeout);
}
