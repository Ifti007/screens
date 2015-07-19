from django.db import models

# Create your models here.
class paymentMethod(models.Model):
    payment_method = models.CharField(max_length=30,unique=True,db_column='PAYMENT_METHOD')
    
    class Meta:
        db_table = 'PAYMENT_METHOD'

class payments(models.Model):
    paymentMethod = models.ForeignKey(paymentMethod)
    price = models.DecimalField( max_digits=7, decimal_places=2,db_column='PRICE')
    amountCharged = models.DecimalField( max_digits=7, decimal_places=2,db_column='AMOUNT_CHARGED')
    amountPaid = models.DecimalField( max_digits=7, decimal_places=2,db_column='AMOUNT_PAID')
    receiptEmail = models.EmailField(max_length=128,db_column='RECEIPT_EMAIL')
    couponCode = models.EmailField(max_length=128,db_column='COUPON_CODE')
    
    class Meta:
        db_table = 'PAYMENT'
        
class products(models.Model):
    #id = models.AutoField(primary_key=True,db_column='PAYMENT_ID')
    name = models.CharField(max_length=128)
    price = models.DecimalField( max_digits=7, decimal_places=2)
    
    class Meta:
        db_table = 'PRODUCTS'
        
class sales(models.Model):
    #id = models.AutoField(primary_key=True,db_column='PAYMENT_ID')
    product = models.ForeignKey(products)
    qty = models.DecimalField( max_digits=7, decimal_places=2)
    price = models.DecimalField( max_digits=7, decimal_places=2)
    amount = models.DecimalField( max_digits=7, decimal_places=2)
    
    class Meta:
        db_table = 'SALES'
