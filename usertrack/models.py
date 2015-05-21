from django.db import models
import datetime


class USER(models.Model):
    #pass
    user_id =  models.IntegerField(primary_key=True,db_column='USER_ID')
    user_name =  models.CharField(max_length=1024,unique=True,db_column='USERNAME')
    #first_name =  models.CharField(max_length=256,db_column='FIRST_NAME')
    #last_name =  models.CharField(max_length=256,db_column='LAST_NAME')

    #def __str__(self):
    #   return unicode(self.user_id)
    def natural_key(self):
        ret={}
        ret['user_id'] = self.user_id
        ret['user_name'] = self.user_name
        return (ret)
        
    class Meta:
      #verbose_name_plural=""
      db_table="IU_USER"


class APPLICATION(models.Model):
    #pass
    application_id =  models.IntegerField(primary_key=True,db_column='APPLICATION_ID')
    application_name =  models.CharField(max_length=1024,unique=True,db_column='APPLICATION_NAME')
    #first_name =  models.CharField(max_length=256,db_column='FIRST_NAME')
    #last_name =  models.CharField(max_length=256,db_column='LAST_NAME')

    #def __str__(self):
    #   return unicode(self.user_id)
    def natural_key(self):
        ret={}
        ret['application_id'] = self.application_id
        ret['application_name'] = self.application_name
        return (ret)
        
    class Meta:
      #verbose_name_plural=""
      db_table="IU_APPLICATION"

#class UserName(models.Field):
#    description = "User Name for a given user_id"
#    
#    def __init__(self,*args,**kwargs):
#        #return unicode(self.user_id)+'@email.com'
#        user_id=kwargs['user_id']
#        super(UserName, self).__init__(*args, **kwargs)

#    def from_db_value(self, value, expression, connection, context):
#        return USER.objects.using('inguser').get(user_id=user_id).user_name

class USER_TRACKED(models.Model):
    track_id =models.AutoField(primary_key=True,db_column='TRACK_ID')
    user = models.ForeignKey(USER,db_column='USER_ID')
    #user_id = models.ForeignKey(USER)
    #user_name = UserName(user_id=user_id)
    #application_id = models.IntegerField(db_column='APPLICATION_ID')
    application = models.ForeignKey(APPLICATION,db_column='APPLICATION_ID')
    start_date = models.DateTimeField(db_column='START_DATE')
    end_date = models.DateTimeField(db_column='END_DATE',null=True)
    num_computers = models.IntegerField(db_column='NUM_COMPUTERS')
    active= models.CharField(max_length=1,default='Y')
    
    # We use properties for simple column lookups. It saves us from custom sql
    #@property
    #def user_name(self):
    #    #return unicode(self.user_id)+'@email.com'
    #    try:
    #      return USER.objects.using('inguser').get(user_id=self.user_id).user_name
    #    except:  
    #      return None
    
        
    def __str__(self):
       return unicode(self.user_id)
    class Meta:
      #verbose_name_plural=""
      db_table="IU_USER_TRACKED"
      #unique_together=('application_id','user_id')

class USER_COMPUTER(models.Model):
    computer_id =  models.AutoField(primary_key=True,db_column='COMPUTER_ID')
    #track_id =  models.IntegerField(db_column='TRACK_ID')
    track_id =  models.ForeignKey(USER_TRACKED)
    track_line_id =  models.IntegerField(db_column='TRACK_LINE_ID')
    mac_address=models.CharField(max_length=60,db_column='MAC_ADDRESS')
    ram_kb=models.IntegerField(db_column='RAM_KB',null=True)
    os_user_name=models.CharField(max_length=120,db_column='OS_USER_NAME',null=True)
    os_name=models.CharField(max_length=60,db_column='OS_NAME',null=True)
    os_version=models.CharField(max_length=60,db_column='OS_VERSION',null=True)
    last_session_dt=models.DateTimeField(db_column='LAST_SESSION_DT')
    last_session_id=models.IntegerField(db_column='LAST_SESSION_ID')

    def __str__(self):
       return self.computer_id
    class Meta:
      #verbose_name_plural=""
      db_table="IU_USER_COMPUTER"
      unique_together = (('track_id', 'track_line_id'),)


class USER_COMPUTER_ATTRIB(models.Model):
    computer_attrib_id =  models.AutoField(primary_key=True,db_column='COMPUTER_ATTRIB_ID')
    #computer_id =  models.IntegerField(db_column='COMPUTER_ID')
    computer_id =  models.ForeignKey(USER_COMPUTER)
    attrib_name =  models.CharField(max_length=60,db_column='ATTRIB_NAME')
    attrib_value =  models.CharField(max_length=128,db_column='ATTRIB_VALUE')

    def __str__(self):
       return self.computer_attrib_id
    class Meta:
      #verbose_name_plural=""
      db_table="IU_USER_COMPUTER_ATTRIB"
      unique_together = (('computer_id', 'attrib_name'),)


      
