//import Image from "next/image";
'use client'
import React, { useState, useEffect,forwardRef, useImperativeHandle, } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  WaitForConfigForm,
  WaitForTimeoutConfigForm,
  GotoConfigForm,
  FillConfigForm,
  DefaultConfigForm,
} from "@/components/action-config-forms"


//export default function FeedConfigForm(config) {
	
// This is options data for select option.
const data = {

  transformerOptions: [
    //{key: "none", label: "None",}, 
	{key: "absoluteUrl", label: "absoluteUrl",},
	{key: "download", label: "download",},
    {key: "downloadInnerImg", label: "downloadInnerImg",},	
	{key: "prefix", label: "prefix",},
	{key: "replaceToEmpty", label: "replaceToEmpty",},
	{key: "suffix", label: "suffix",},
    {key: "trim", label: "trim",},
  ],
  
  phaseOptions: [
    //{key: "none", label: "None",},
    {key: "beforeGoto", label: "beforeGoto",},
	{key: "afterGoto", label: "afterGoto",},
	{key: "afterParse", label: "afterParse",},
  ],
  
  actionOptions: [
    //{key: "none", label: "None",},
    {key: "check", label: "check",},
	{key: "clear", label: "clear",},
	{key: "click", label: "click",},
	{key: "dblclick", label: "dblclick",},
	{key: "fill", label: "fill",},
    {key: "goto", label: "goto",},
	{key: "selectOption", label: "selectOption",},
	{key: "uncheck", label: "uncheck",},	
	{key: "waitFor", label: "waitFor",},
	{key: "waitForTimeout", label: "waitForTimeout",},
  ],  
}


const FeedConfigForm = forwardRef((props, ref) => {
	
  useImperativeHandle(ref, () => ({
    getValue: () => {
		console.log("useImperativeHandle getValue");
		//过滤name 为空的字段，
		let fieldsTmp = [...fields];
		fieldsTmp = fieldsTmp.filter((ele, idx) => ele.name !=  "");
		
		
		let fieldsTmpInItem = [...fieldsInItem];
		fieldsTmpInItem = fieldsTmpInItem.filter((ele, idx) => ele.name !=  "");			
		
		let configTmp = {
		    feedParser:{
			  selector:selector,
			  fields:fieldsTmp,
			},
		    pagination:pagination,
		    itemParser:{
			  disableScrapeItem:disableScrapeItem,
			  disableAutoScrapeContent:disableAutoScrapeContent,
			  downloadContentImg:downloadContentImg,
			  fields:fieldsTmpInItem,
			},
            feedActions	:feedActions,
			itemActions	:itemActions,			
		};
        return configTmp;		
	},
    clear: () => {
      //inputRef.current.value = '';
    },
  }));	
  
  const [selector, setSelector] = React.useState("");
  
  const [pagination, setPagination] = useState({
    type: 'none',
    selector: '',
	pattern: '',
	initial: '',
	increment: '',
	num: '',
  });
  
  const [fields, setFields] = useState([
    {   
      name: '',
      selector: '',
	  attribute:'',
      transformer:'',
      transformerArg:'',	  
	},
  ]); 
  
  const [fieldsInItem, setFieldsInItem] = useState([
    {   
      name: '',
      selector: '',
	  attribute:'',
      transformer:'',
      transformerArg:'',	  
	},
  ]); 
  
  
  const [feedActions, setFeedActions] = useState([]); 
  
  const [itemActions, setItemActions] = useState([]);  
  
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState({});
  
  const [currentActionType, setCurrentActionType] = React.useState("");
  const [currentActionIndex, setCurrentActionIndex] = React.useState(-1); 

  const [disableScrapeItem, setDisableScrapeItem] = React.useState(false); 
  const [disableAutoScrapeContent, setDisableAutoScrapeContent] = React.useState(false); 
  const [downloadContentImg, setDownloadContentImg] = React.useState(false);  
  //const [feedActionDialogOpen, setFeedActionDialogOpen] = React.useState(false);
  
  //const [itemActionDialogOpen, setItemActionDialogOpen] = React.useState(false);
  
  //const [currentFeedAction, setCurrentFeedAction] = React.useState({}); 

  //const [currentItemAction, setCurrentItemAction] = React.useState({});  

  const handlePaginationChange = (value, propName) => {
	  
	//  console.log("e", e);
    //const { name, value } = e.target;
	
	
	//let prefix = "pagination-"
	//const str = "Hello, World!";
    //const propName = name.substring(prefix.length);
	
	//console.log("propName", propName);
	//console.log("value", value);
	let newPagination = {
      ...pagination,
      [propName]: value
    };
	//console.log("newItem", newItem);
    setPagination(newPagination);
  };  

 
  
  const handleFieldsChange = (index, e) => {
  //handleFieldsChange(index, e){
     //let data = this.state.parserFields || [];
	 console.log("handleFieldsChange", e); 
	let newFields = [...fields]; 
    newFields[index][e.target.name] = e.target.value;
    setFields(newFields); 
  } 

  const handleFeedTransformerChange = (index, value) => {
	let newFields = [...fields]; 
    newFields[index]["transformer"] = value;
    setFields(newFields); 
  }  
  
  const addEmptyField = (e) => {
    e.preventDefault();  

	//console.log("addFields", e);    
	
    let newfield = { name: '', selector: '', attribute: '', transformer:'', transformerArg:'', }
	
	setFields([...fields, newfield]);


  }
  
  const removeFields = (index, e) => {
    e.preventDefault();    

	// console.log("removeFields", index); 
    let newFields = [...fields];
    newFields.splice(index, 1)

    setFields(newFields);	 

  } 


  
  const handleFieldsChangeInItem = (index, e) => {
  //handleFieldsChange(index, e){
     //let data = this.state.parserFields || [];
	 console.log("handleFieldsChange", e); 
	let newFieldsInItem = [...fieldsInItem]; 
    newFieldsInItem[index][e.target.name] = e.target.value;
    setFieldsInItem(newFieldsInItem); 
  } 

  const handleItemTransformerChange = (index, value) => {
	let newFieldsInItem = [...fieldsInItem]; 
    newFieldsInItem[index]["transformer"] = value;
    setFieldsInItem(newFieldsInItem);
  } 
  
  
  const addEmptyFieldInItem = (e) => {
    e.preventDefault();  

	//console.log("addFields", e);    
	
    let newfield = { name: '', selector: '', attribute: '', transformer:'', transformerArg:'', }
	
	setFieldsInItem([...fieldsInItem, newfield]);


  }
  
  const removeFieldsInItem = (index, e) => {
    e.preventDefault();    

	// console.log("removeFields", index); 
    let newFieldsInItem = [...fieldsInItem];
    newFieldsInItem.splice(index, 1)

    setFieldsInItem(newFieldsInItem);	 

  }  
  


  const addAction = (type, e) => {
    e.preventDefault();  

	console.log("addConfigAction", e); 

    setDialogOpen(true);
    setCurrentActionType(type);
	setCurrentActionIndex(-1);
	setCurrentAction({});	
  }
  
  const removeAction = (index, type, e) => {
	 e.preventDefault();   
	 console.log("removeConfigAction", index); 
	 
	 if(type == "feed"){
		let newFeedActions = [...feedActions];
		newFeedActions.splice(index, 1)

		setFeedActions(newFeedActions);			 
	 }else if(type == "item"){
		let newItemActions = [...itemActions];
		newItemActions.splice(index, 1)

		setItemActions(newItemActions);		 
	 }
  }    
  
  const editAction = (index, type, e) => {
	 e.preventDefault();   
	 console.log("editConfigAction", index);
    if(type == 'feed'){
		let actionTmp = feedActions[index];
		
		setCurrentAction({...actionTmp});
        setCurrentActionType(type);
        setCurrentActionIndex(index);
        setDialogOpen(true);		
		
	}else if(type == 'item'){
		let actionTmp = itemActions[index];
		
		setCurrentAction({...actionTmp});
        setCurrentActionType(type);
        setCurrentActionIndex(index);
        setDialogOpen(true);		
	}		
  }

  const saveAction = (e) => {
	 e.preventDefault();   
	 console.log("saveAction", e);
	 if(currentActionType == 'feed'){
		 
		let newFeedActions = [...feedActions];
		//newFeedActions.splice(index, 1)
		if(currentActionIndex >= 0){
			newFeedActions[currentActionIndex] = currentAction;
		}else{
			newFeedActions.push(currentAction);
		}
		setFeedActions(newFeedActions);	
        
		//reset currentAction related state
        setCurrentActionType('');
        setCurrentActionIndex(-1);
        setCurrentAction({});
        setDialogOpen(false);		
		//currentActionIndex
		 
	 }else if(currentActionType == 'item'){
		let newItemActions = [...itemActions];
		//newFeedActions.splice(index, 1)
		if(currentActionIndex >= 0){
			newItemActions[currentActionIndex] = currentAction;
		}else{
			newItemActions.push(currentAction);
		}
		setItemActions(newItemActions);	

        setCurrentActionType('');
        setCurrentActionIndex(-1);
        setCurrentAction({});
        setDialogOpen(false);
		
	 }
	 
  }
  
  const cancelAction = (e) => {
    e.preventDefault();  

	console.log("cancelAction", e); 

    setDialogOpen(false);
    setCurrentActionType('');
	setCurrentActionIndex(-1);
	setCurrentAction({});	
  }
    
  
  const handleActionNameChange = (value) => {
	let newCurrentAction = {
      ...currentAction,
      name: value
    };
	//console.log("newItem", newItem);
    setCurrentAction(newCurrentAction);
  };

  const handleActionPhaseChange = (value) => {
	let newCurrentAction = {
      ...currentAction,
      phase: value
    };
	//console.log("newItem", newItem);
    setCurrentAction(newCurrentAction);
  }; 
  

  


  const actionConfigForm = (action) => {
	let name = action.name || "";
	  if (name == "goto") {
		return <GotoConfigForm defaultConfig={action.config || {url:"",}} onConfigChange={handleActionConfigChange}/>;
	  }else if(name == "fill"){
		return <FillConfigForm defaultConfig={action.config || {selector:"", value:"",}} onConfigChange={handleActionConfigChange}/>;  
	  }else if(name == "waitForTimeout"){
		return <WaitForTimeoutConfigForm defaultConfig={action.config || {timeout:"",}} onConfigChange={handleActionConfigChange}/>;    
	  }else if(name == "waitFor"){
		return <WaitForConfigForm defaultConfig={action.config || {selector:"", timeout:"",}} onConfigChange={handleActionConfigChange}/>;    
	  }else if(name == "selectOption"){
		return <SelectOptionConfigForm defaultConfig={action.config || {selector:"", value:"",}} onConfigChange={handleActionConfigChange}/>;    
	  }else{
		return <DefaultConfigForm defaultConfig={action.config || {selector:"",}} onConfigChange={handleActionConfigChange}/>;    
	  }
	  
	  
	  //return <li className="item">{name}</li>;
  } 

  const handleActionConfigChange = (newConfig) => {
    //setChildCount(newCount); // 更新父组件中的状态
	let newCurrentAction = {
      ...currentAction,
      config: newConfig
    };
	console.log("newConfig", newConfig);
    setCurrentAction(newCurrentAction);	
    //console.log("Child count updated:", newCount);
  };   
  

 useEffect(() => {
	 
	let feedConfig = props.feedConfig || {}
	console.log("feedConfig", feedConfig); 
	 
	setSelector(feedConfig?.feedParser?.selector || "");
	
	setPagination(feedConfig?.pagination || {type:"none", selector:""});
	
	//let field
	let fieldsTmp = feedConfig?.feedParser?.fields || [];
	
	console.log("fieldsTmp", fieldsTmp);
	if(fieldsTmp.length > 0){
		setFields(fieldsTmp);
	}
	let fieldsTmpInItem = feedConfig?.itemParser?.fields || [];
	if(fieldsTmpInItem.length > 0){
		setFieldsInItem(fieldsTmpInItem);
	}
	
	let feedActionsTmp = feedConfig?.feedActions || [];
	if(feedActionsTmp.length > 0){
		setFeedActions(feedActionsTmp);
	}
	let itemActionsTmp = feedConfig?.itemActions || [];
	if(itemActionsTmp.length > 0){
		setItemActions(itemActionsTmp);
	}	
	
	
	let disableScrapeItemTmp = feedConfig?.itemParser?.disableScrapeItem || false;
    setDisableScrapeItem(disableScrapeItemTmp);
	let disableAutoScrapeContentTmp = feedConfig?.itemParser?.disableAutoScrapeContent || false;
    setDisableAutoScrapeContent(disableAutoScrapeContentTmp);
	let downloadContentImgTmp = feedConfig?.itemParser?.downloadContentImg || false;
    setDownloadContentImg(downloadContentImgTmp);
	
  }, []);

  return (
      <div className="">
	  
      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">种子采集配置</TabsTrigger>
          <TabsTrigger value="page">分页采集配置</TabsTrigger>
		  <TabsTrigger value="item">详情采集配置</TabsTrigger>
        </TabsList>
        <TabsContent value="feed">
          <Card>
            <CardContent className="grid gap-6">		  
			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="selector">上下文选择器</FieldLabel>
				</div>
				<Input id="selector" name="selector" type="text"  value={selector} onChange={(e) => setSelector(e.target.value)} required />
			  </Field>
			  
			  <Table>
				<TableHeader>
				  <TableRow>
					<TableHead>字段名</TableHead>
					<TableHead>选择器</TableHead>
					<TableHead>属性名</TableHead>
					<TableHead>转换器</TableHead>
					<TableHead>转换参数</TableHead>
					<TableHead>删除</TableHead>
				 </TableRow>
				</TableHeader>
				<TableBody>
				 {fields.map((field, index) => (
				   <TableRow key={index}>
					 <TableCell>
						<Input name="name" type="text"  value={field.name} onChange={(e) => handleFieldsChange(index, e)} />
					 </TableCell>
					 <TableCell>
						<Input name="selector" type="text"  value={field.selector} onChange={(e) => handleFieldsChange(index, e)} />
					 </TableCell>
					 <TableCell>
						 <Input name="attribute" type="text"  value={field.attribute} onChange={(e) => handleFieldsChange(index, e)} />
					 </TableCell>
					 <TableCell>
						<Select name="transformer" value={ field.transformer} onValueChange={ (value) => handleFeedTransformerChange(index, value)}>
						  <SelectTrigger className="w-[180px]">
							<SelectValue placeholder="选择转换器" />
						  </SelectTrigger>
						  <SelectContent>
							<SelectGroup>
							  <SelectItem value={null}>None</SelectItem>
							 {data.transformerOptions.map((transformerOption, index) => (
							
							  <SelectItem key={index} value={transformerOption.key}>{transformerOption.label}</SelectItem>
							  ))
							 }
							 
							</SelectGroup>
						  </SelectContent>
						</Select>
					 </TableCell>
					 <TableCell>
						 <Input name="transformerArg" type="text"  value={field.transformerArg} onChange={(e) => handleFieldsChange(index, e)} />
					 </TableCell>			 
					 <TableCell>
					   <Button onClick={(e) => removeFields(index, e)}>删除</Button>
					 </TableCell>

				   </TableRow>
				 ))}
			   </TableBody>
			 </Table>		  
				
			 <Button className="w-32" onClick={(e) => addEmptyField(e)}>添加字段映射</Button>	


			 <Table>
			   <TableHeader>
				 <TableRow>
				 
				   <TableHead>阶段</TableHead>
				   <TableHead>动作</TableHead>
				   <TableHead>配置</TableHead>
				   <TableHead>编辑</TableHead>
				   <TableHead>删除</TableHead>
				 </TableRow>
			   </TableHeader>
			   <TableBody>
				 {feedActions.map((action, index) => (
				   <TableRow key={index}>
					 <TableCell>
					 {action.phase}
					 </TableCell>
					 <TableCell>
					  {action.name}
					 </TableCell>			 
					 
					 <TableCell>
					  {JSON.stringify(action.config)}
					 </TableCell>
					 <TableCell>
						<Button onClick={(e) => editAction(index, 'feed', e)}>编辑</Button>
					 </TableCell>
					 <TableCell>
					   <Button onClick={(e) => removeAction(index, 'feed', e)}>删除</Button>
					 </TableCell>

				   </TableRow>
				 ))}
			   </TableBody>
			 </Table>		  
				
			 <Button className="w-32" onClick={(e) => addAction('feed', e)}>添加动作</Button>		 
		    </CardContent>
		  </Card>
	    </TabsContent>
        <TabsContent value="page">	
          <Card>
            <CardContent className="grid gap-6">	
			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-type">分页类型</FieldLabel>
				</div>
							
				<Select id="pagination-type" name="pagination-type" value={pagination.type} onValueChange={ (value) => handlePaginationChange(value, "type")}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择分页类型" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>
					  <SelectItem value="none">无分页</SelectItem>
					  <SelectItem value="selector">选择器</SelectItem>
					  <SelectItem value="pattern">模式</SelectItem>
					</SelectGroup>
				  </SelectContent>
				</Select>
				
			  </Field>	
            { pagination.type == "selector" && (
			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-selector">分页选择器</FieldLabel>
				</div>
				<Input id="pagination-selector" name="pagination-selector" type="text"  value={pagination.selector} onChange={(e) => handlePaginationChange(e.target.value, "selector")} />
			  </Field>
			)}

			{ pagination.type == "pattern" && (
			 <FieldGroup>
			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-pattern">模式</FieldLabel>
				</div>
				<Input id="pagination-pattern" name="pagination-pattern" type="text"  value={pagination.pattern} onChange={(e) => handlePaginationChange(e.target.value, "pattern")} />
			  </Field>			  

			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-initial">初始</FieldLabel>
				</div>
				<Input id="pagination-initial" name="pagination-initial" type="text"  value={pagination.initial} onChange={(e) => handlePaginationChange(e.target.value, "initial")} />
			  </Field>
			  

			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-increment">增量</FieldLabel>
				</div>
				<Input id="pagination-increment" name="pagination-increment" type="text"  value={pagination.increment} onChange={(e) => handlePaginationChange(e.target.value, "increment")} />
			  </Field>

			  <Field>
				<div className="flex items-center">
				  <FieldLabel htmlFor="pagination-num">总数</FieldLabel>
				</div>
				<Input id="pagination-num" name="pagination-num" type="text"  value={pagination.num} onChange={(e) => handlePaginationChange(e.target.value, "num")} />
			  </Field>			  
			  </FieldGroup>
			 )} 
		    </CardContent>
		  </Card>		
	    </TabsContent>
        <TabsContent value="item">
          <Card>
            <CardContent className="grid gap-6">
			
			<div className="flex items-start gap-3">
				<Checkbox id="disableScrapeItem" name="disableScrapeItem" checked={disableScrapeItem} onCheckedChange={setDisableScrapeItem} />
				<div className="grid gap-2">
				  <Label htmlFor="disableScrapeItem">禁止抓取详情</Label>
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox id="disableAutoScrapeContent" name="disableAutoScrapeContent" checked={disableAutoScrapeContent} onCheckedChange={setDisableAutoScrapeContent} />
				<div className="grid gap-2">
				  <Label htmlFor="disableAutoScrapeContent">禁止自动提取正文</Label>
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Checkbox id="downloadContentImg" name="downloadContentImg" checked={downloadContentImg} onCheckedChange={setDownloadContentImg} />
				<div className="grid gap-2">
				  <Label htmlFor="downloadContentImg">自动下载正文图片</Label>
				</div>
			</div>			
		 <Table>
		   <TableHeader>
			 <TableRow>
			   <TableHead>字段名</TableHead>
			   <TableHead>选择器</TableHead>
			   <TableHead>属性名</TableHead>
			   <TableHead>转换器</TableHead>
			   <TableHead>转换参数</TableHead>		   
			   <TableHead>删除</TableHead>
			 </TableRow>
		   </TableHeader>
		   <TableBody>
			 {fieldsInItem.map((field, index) => (
			   <TableRow key={index}>
				 <TableCell>
					<Input name="name" type="text"  value={field.name} onChange={(e) => handleFieldsChangeInItem(index, e)} />
				 </TableCell>
				 <TableCell>
					<Input name="selector" type="text"  value={field.selector} onChange={(e) => handleFieldsChangeInItem(index, e)} />
				 </TableCell>
				 <TableCell>
					 <Input name="attribute" type="text"  value={field.attribute} onChange={(e) => handleFieldsChangeInItem(index, e)} />
				 </TableCell>
				 <TableCell>
				 
					<Select name="transformer" value={ field.transformer} onValueChange={ (value) => handleItemTransformerChange(index, value)}>
					  <SelectTrigger className="w-[180px]">
						<SelectValue placeholder="选择转换器" />
					  </SelectTrigger>
					  <SelectContent>
						<SelectGroup>
						
						  <SelectItem value={null}>None</SelectItem>
						 {data.transformerOptions.map((transformerOption, index) => (
						
						  <SelectItem key={index} value={transformerOption.key}>{transformerOption.label}</SelectItem>
						  ))
						 }						

						</SelectGroup>
					  </SelectContent>
					</Select>				 
					
				 </TableCell>
				 <TableCell>
					 <Input name="transformerArg" type="text"  value={field.transformerArg} onChange={(e) => handleFieldsChangeInItem(index, e)} />
				 </TableCell>			 
				 
				 <TableCell>
				   <Button onClick={(e) => removeFieldsInItem(index, e)}>删除</Button>
				 </TableCell>

			   </TableRow>
			 ))}
		   </TableBody>
		 </Table>		  
			
		 <Button className="w-32" onClick={(e) => addEmptyFieldInItem(e)}>添加字段映射</Button>
		 
		 
		 <Table>
		   <TableHeader>
			 <TableRow>
			   <TableHead>阶段</TableHead>
			   <TableHead>动作</TableHead>	   
			   <TableHead>配置</TableHead>
			   <TableHead>编辑</TableHead>
			   <TableHead>删除</TableHead>
			 </TableRow>
		   </TableHeader>
		   <TableBody>
			 {itemActions.map((action, index) => (
			   <TableRow key={index}>
				 <TableCell>
				{action.phase}
				 </TableCell>
				 <TableCell>
				 {action.name}
				 </TableCell>			 
				 
				 <TableCell>
				  {JSON.stringify(action.config)}
				 </TableCell>
				 <TableCell>
					<Button onClick={(e) => editAction(index, 'item', e)}>编辑</Button>
				 </TableCell>
				 <TableCell>
				   <Button onClick={(e) => removeAction(index, 'item', e)}>删除</Button>
				 </TableCell>

			   </TableRow>
			 ))}
		   </TableBody>
		 </Table>		  
			
		 <Button className="w-32" onClick={(e) => addAction('item', e)}>添加动作</Button>			 

		    </CardContent>
		  </Card>			
	    </TabsContent>		
      </Tabs>
	
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>动作配置</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
		  
            <div className="grid gap-3">
              <Label htmlFor="username-1">执行阶段</Label>
                  <Select id="action-phase" name="action-phase" value={ currentAction.phase} onValueChange={ handleActionPhaseChange}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择阶段" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>	
					     <SelectItem value={null}>None</SelectItem>
						{data.phaseOptions.map((phaseOption, index) => (
							
						  <SelectItem key={index} value={phaseOption.key}>{phaseOption.label}</SelectItem>
						))
						}					

					</SelectGroup>
				  </SelectContent>
				</Select>
            </div>		  
		  
            <div className="grid gap-3">
              <Label htmlFor="name-1">动作名</Label>
                <Select id="action-name" name="action-name" value={ currentAction.name} onValueChange={ handleActionNameChange}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择动作" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>
					     <SelectItem value={null}>None</SelectItem>
						{data.actionOptions.map((actionOption, index) => (
							
						  <SelectItem key={index} value={actionOption.key}>{actionOption.label}</SelectItem>
						))
						}


					</SelectGroup>
				  </SelectContent>
				</Select>			  
			  
              
            </div>

			 <div className="grid gap-3">
			 { actionConfigForm(currentAction)}
			 </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={(e) => cancelAction(e)}>取消</Button>
            </DialogClose>
            <Button type="submit" onClick={(e) => saveAction(e)}>保存</Button>
          </DialogFooter>
        </DialogContent>

      </Dialog>		


    </div>
  );
}
);


export {
  FeedConfigForm,
}
