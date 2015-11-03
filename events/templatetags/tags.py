import datetime
from django import template

register = template.Library()

@register.simple_tag
def current_time(format_string):
    return datetime.datetime.now().strftime(format_string)

@register.assignment_tag
def get_menu(menuName='main'):
    menuList = { 'main':[
                         {'caption':'Organization','url':'#','img_url':'image','subMenu':'org','description':'Description for organization'}
                         ,{'caption':'Events','url':'#','img_url':'image','subMenu':'events','description':'Description for events'}
                         ,{'caption':'Membership','url':'#','img_url':'image','subMenu':'member','description':'Description for membership'}
                         ]
                ,'org': [
                         {'caption':'Create New Org','url':'orgtype','img_url':'image','subMenu':'None','description':'Description for create organization'}
                         ,{'caption':'Manage','url':'#','img_url':'image_url','subMenu':'None','description':'Description for manage organization'}
                         ]
                ,'events':[
                           {'caption':'Create New Event','url':'#','img_url':'image','subMenu':'None','description':'Description for create event'}
                           ,{'caption':'Manage','url':'#','img_url':'image','subMenu':'None','description':'Description for manage event'}
                           ,{'caption':'Dashboard','url':'#','img_url':'image','subMenu':'None','description':'Description for event dashboard'}
                           ]
            }
        
    return menuList.get(menuName)

@register.assignment_tag
def get_form(formName='orgType'):
    formList = { 'orgType':
                {
                 'name':'Organization Type'
                ,'description':'Specify Organization type, possible values non-profit, hobby, private, personal'
                ,'html_name':'frmOrgType'
                ,'fields':[
                          {'name':'orgType'
                           ,'label':'Organization Type'
                           ,'required':'true'
                           ,'attrs':{'placeholder':'Enter Organization Type'
                                     ,'ng-model':'_edits.orgType'
                                     }
                           }
                           ,{'name':'orgDescr'
                           ,'label':'Description'
                           ,'required':'true'
                           ,'attrs':{'placeholder':'Enter Description'
                                     ,'ng-model':'_edits.orgDescr'
                                     }
                           }]
                           
                ,'help_texts':{
                        'uom':'Enter uom',
                        'description':'Enter description'} 
                 }
                ,'org': [
                         {'caption':'Create New Org','url':'#','img_url':'image','subMenu':'None','description':'Description for create organization'}
                         ,{'caption':'Manage','url':'#','img_url':'image_url','subMenu':'None','description':'Description for manage organization'}
                         ]
                ,'events':[
                           {'caption':'Create New Event','url':'#','img_url':'image','subMenu':'None','description':'Description for create event'}
                           ,{'caption':'Manage','url':'#','img_url':'image','subMenu':'None','description':'Description for manage event'}
                           ,{'caption':'Dashboard','url':'#','img_url':'image','subMenu':'None','description':'Description for event dashboard'}
                           ]
            }
        
    return formList.get(formName)