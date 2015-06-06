# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='attendee',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('memberId', models.IntegerField(null=True, db_column='MEMBER_ID')),
                ('amount', models.DecimalField(db_column='PAYMENT_ID', decimal_places=2, max_digits=7, default=0)),
                ('firstName', models.CharField(max_length=128, db_column='FIRST_NAME')),
                ('lastName', models.CharField(max_length=128, db_column='LAST_NAME')),
                ('email', models.CharField(max_length=128, null=True, db_column='EMAIL')),
                ('company', models.CharField(max_length=128, null=True, db_column='COMPANY')),
                ('title', models.CharField(max_length=128, null=True, db_column='TITLE')),
                ('badgePrintDate', models.DateTimeField(null=True, db_column='BADGE_PRINT_DATE')),
                ('badgePrintCount', models.IntegerField(null=True, db_column='BADGE_PRINT_COUNT')),
                ('registrationDate', models.DateTimeField(null=True, db_column='REGISTRATION_DATE')),
            ],
            options={
                'db_table': 'ATTENDEE',
            },
        ),
        migrations.CreateModel(
            name='attendeeType',
            fields=[
                ('id', models.AutoField(db_column='ATTENDEE_TYPE_ID', primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, db_column='ATTENDEE_TYPE', unique=True)),
                ('price', models.DecimalField(db_column='PRICE', max_digits=7, decimal_places=2)),
            ],
            options={
                'db_table': 'ATTENDEE_TYPE',
            },
        ),
        migrations.CreateModel(
            name='MEMBER',
            fields=[
                ('memberId', models.IntegerField(db_column='MEMBER_ID', primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, db_column='NAME', unique=True)),
                ('phone', models.CharField(max_length=128, db_column='PHONE')),
                ('company', models.CharField(max_length=128, db_column='COMPANY')),
                ('email', models.EmailField(max_length=128, db_column='EMAIL')),
                ('position', models.CharField(max_length=128, db_column='POSITION')),
                ('startDate', models.DateTimeField(db_column='START_DATE')),
                ('expiryDate', models.DateTimeField(db_column='EXPIRY_DATE')),
                ('street_1', models.CharField(max_length=128, db_column='STREET_1')),
                ('street_2', models.CharField(max_length=128, db_column='STREET_2')),
                ('city', models.CharField(max_length=128, db_column='CITY')),
                ('state', models.CharField(max_length=128, db_column='STATE')),
                ('zip', models.CharField(max_length=128, db_column='ZIP_CODE')),
                ('country', models.CharField(max_length=128, db_column='COUNTRY')),
                ('spouse', models.CharField(max_length=129, db_column='SPOUSE_NAME')),
            ],
            options={
                'db_table': 'MEMBER',
            },
        ),
        migrations.CreateModel(
            name='MEMBER_CATEGORY',
            fields=[
                ('id', models.AutoField(db_column='CATEGORY_ID', primary_key=True, serialize=False)),
                ('category', models.CharField(max_length=30, db_column='CATEGORY', unique=True)),
                ('annualPrice', models.DecimalField(null=True, decimal_places=2, max_digits=7, db_column='ANNUAL_PRICE')),
            ],
            options={
                'db_table': 'MEMBER_CATEGORY',
            },
        ),
        migrations.CreateModel(
            name='PAYMENT',
            fields=[
                ('id', models.AutoField(db_column='PAYMENT_ID', primary_key=True, serialize=False)),
                ('price', models.DecimalField(db_column='PRICE', max_digits=7, decimal_places=2)),
                ('amountCharged', models.DecimalField(db_column='AMOUNT_CHARGED', max_digits=7, decimal_places=2)),
                ('amountPaid', models.DecimalField(db_column='AMOUNT_PAID', max_digits=7, decimal_places=2)),
                ('receiptEmail', models.EmailField(max_length=128, db_column='RECEIPT_EMAIL')),
                ('couponCode', models.EmailField(max_length=128, db_column='COUPON_CODE')),
            ],
            options={
                'db_table': 'PAYMENT',
            },
        ),
        migrations.CreateModel(
            name='PAYMENT_METHOD',
            fields=[
                ('id', models.AutoField(db_column='PAYMENT_METHOD_ID', primary_key=True, serialize=False)),
                ('payment_method', models.CharField(max_length=30, db_column='PAYMENT_METHOD', unique=True)),
            ],
            options={
                'db_table': 'PAYMENT_METHOD',
            },
        ),
        migrations.AddField(
            model_name='payment',
            name='paymentMethod',
            field=models.ForeignKey(db_column='PAYMENT_METHOD_ID', to='events.PAYMENT_METHOD'),
        ),
        migrations.AddField(
            model_name='member',
            name='category',
            field=models.ForeignKey(db_column='ID', to='events.MEMBER_CATEGORY'),
        ),
        migrations.AddField(
            model_name='attendee',
            name='attendeeType',
            field=models.ForeignKey(db_column='ATTENDEE_TYPE_ID', to='events.attendeeType'),
        ),
    ]
