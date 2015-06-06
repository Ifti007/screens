from django.db import models

# Create your models here.

class MEMBER_CATEGORY(models.Model):
	id = models.AutoField(primary_key=True,db_column='CATEGORY_ID')
	category = models.CharField(max_length=30,unique=True,db_column='CATEGORY')
	annualPrice = models.DecimalField(max_digits=7, decimal_places=2,db_column='ANNUAL_PRICE',null=True)
	
	class Meta:
		db_table = 'MEMBER_CATEGORY'
		
class MEMBER(models.Model):
	memberId = models.IntegerField(primary_key=True,db_column='MEMBER_ID')
	category = models.ForeignKey(MEMBER_CATEGORY,db_column='ID')
	name = models.CharField(max_length=128,unique=True,db_column='NAME')
	phone = models.CharField(max_length=128,db_column='PHONE')
	company = models.CharField(max_length=128,db_column='COMPANY')
	email = models.EmailField(max_length=128,db_column='EMAIL')
	position = models.CharField(max_length=128,db_column='POSITION')
	startDate = models.DateTimeField(db_column='START_DATE')
	expiryDate = models.DateTimeField(db_column='EXPIRY_DATE')
	street_1 = models.CharField(max_length=128,db_column='STREET_1')
	street_2 = models.CharField(max_length=128,db_column='STREET_2')
	city = models.CharField(max_length=128,db_column='CITY')
	state = models.CharField(max_length=128,db_column='STATE')
	zip = models.CharField(max_length=128,db_column='ZIP_CODE')
	country = models.CharField(max_length=128, db_column='COUNTRY')
	spouse = models.CharField(max_length=129, db_column='SPOUSE_NAME')
	
	class Meta:
		db_table = 'MEMBER'

		

class attendeeType(models.Model):
	id = models.AutoField(primary_key=True,db_column='ATTENDEE_TYPE_ID')
	name = models.CharField(max_length=128,unique=True,db_column='ATTENDEE_TYPE')
	price = models.DecimalField( max_digits=7, decimal_places=2,db_column='PRICE')
	
	def natural_key(self):
		ret={}
		ret['id'] = self.id
		ret['name'] = self.name
		#ret['price'] = self.price
		return ret
				
	def __str__(self):
		return self.name + ':' + str(self.price)
				
	class Meta:
		db_table = 'ATTENDEE_TYPE'
		
class PAYMENT_METHOD(models.Model):
	id = models.AutoField(primary_key=True,db_column='PAYMENT_METHOD_ID')
	payment_method = models.CharField(max_length=30,unique=True,db_column='PAYMENT_METHOD')
	
	class Meta:
		db_table = 'PAYMENT_METHOD'

class PAYMENT(models.Model):
	id = models.AutoField(primary_key=True,db_column='PAYMENT_ID')
	paymentMethod = models.ForeignKey(PAYMENT_METHOD,db_column='PAYMENT_METHOD_ID')
	price = models.DecimalField( max_digits=7, decimal_places=2,db_column='PRICE')
	amountCharged = models.DecimalField( max_digits=7, decimal_places=2,db_column='AMOUNT_CHARGED')
	amountPaid = models.DecimalField( max_digits=7, decimal_places=2,db_column='AMOUNT_PAID')
	receiptEmail = models.EmailField(max_length=128,db_column='RECEIPT_EMAIL')
	couponCode = models.EmailField(max_length=128,db_column='COUPON_CODE')
	
	class Meta:
		db_table = 'PAYMENT'
		
	
class attendee(models.Model):
	attendeeType = models.ForeignKey(attendeeType,db_column='ATTENDEE_TYPE_ID')
	memberId = models.IntegerField(db_column='MEMBER_ID',null=True)
	amount = models.DecimalField(max_digits=7,decimal_places=2,db_column='PAYMENT_ID',default=0)
	firstName = models.CharField(max_length=128,db_column='FIRST_NAME')
	lastName = models.CharField(max_length=128,db_column='LAST_NAME')
	email = models.CharField(max_length=128,db_column='EMAIL',null=True)
	company = models.CharField(max_length=128,db_column='COMPANY',null=True)
	title = models.CharField(max_length=128,db_column='TITLE',null=True)
	badgePrintDate = models.DateTimeField(db_column='BADGE_PRINT_DATE',null=True)
	badgePrintCount = models.IntegerField(db_column='BADGE_PRINT_COUNT',null=True)
	registrationDate = models.DateTimeField(db_column='REGISTRATION_DATE',null=True)
	
	def __str__(self):
		return self.firstName + ' ' + self.lastName

	
	class Meta:
		db_table = 'ATTENDEE'
		
			    

	
	
