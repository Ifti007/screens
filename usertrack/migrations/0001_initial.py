# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='USER',
            fields=[
                ('user_id', models.IntegerField(serialize=False, primary_key=True, db_column=b'USER_ID')),
                ('user_name', models.CharField(unique=True, max_length=1024, db_column=b'USER_NAME')),
                ('first_name', models.CharField(max_length=256, db_column=b'FIRST_NAME')),
                ('last_name', models.CharField(max_length=256, db_column=b'LAST_VALUE')),
            ],
            options={
                'db_table': 'IU_USER',
            },
        ),
        migrations.CreateModel(
            name='USER_COMPUTER',
            fields=[
                ('computer_id', models.AutoField(serialize=False, primary_key=True, db_column=b'COMPUTER_ID')),
                ('track_line_id', models.IntegerField(db_column=b'TRACK_LINE_ID')),
                ('mac_address', models.CharField(max_length=60, db_column=b'MAC_ADDRESS')),
                ('ram_kb', models.IntegerField(null=True, db_column=b'RAM_KB')),
                ('os_user_name', models.CharField(max_length=120, null=True, db_column=b'OS_USER_NAME')),
                ('os_name', models.CharField(max_length=60, null=True, db_column=b'OS_NAME')),
                ('os_version', models.CharField(max_length=60, null=True, db_column=b'OS_VERSION')),
                ('last_session_dt', models.DateTimeField(db_column=b'LAST_SESSION_DT')),
                ('last_session_id', models.IntegerField(db_column=b'LAST_SESSION_ID')),
            ],
            options={
                'db_table': 'IU_USER_COMPUTER',
            },
        ),
        migrations.CreateModel(
            name='USER_COMPUTER_ATTRIB',
            fields=[
                ('computer_attrib_id', models.AutoField(serialize=False, primary_key=True, db_column=b'COMPUTER_ATTRIB_ID')),
                ('attrib_name', models.CharField(max_length=60, db_column=b'ATTRIB_NAME')),
                ('attrib_value', models.CharField(max_length=128, db_column=b'ATTRIB_VALUE')),
                ('computer_id', models.ForeignKey(to='usertrack.USER_COMPUTER')),
            ],
            options={
                'db_table': 'IU_USER_COMPUTER_ATTRIB',
            },
        ),
        migrations.CreateModel(
            name='USER_TRACKED',
            fields=[
                ('track_id', models.AutoField(serialize=False, primary_key=True, db_column=b'TRACK_ID')),
                ('application_id', models.IntegerField(db_column=b'APPLICATION_ID')),
                ('start_date', models.DateTimeField(db_column=b'START_DATE')),
                ('end_date', models.DateTimeField(null=True, db_column=b'END_DATE')),
                ('num_computers', models.IntegerField(db_column=b'NUM_COMPUTERS')),
                ('active', models.CharField(default=b'Y', max_length=1)),
                ('user_id', models.ForeignKey(to='usertrack.USER')),
            ],
            options={
                'db_table': 'IU_USER_TRACKED',
            },
        ),
        migrations.AddField(
            model_name='user_computer',
            name='track_id',
            field=models.ForeignKey(to='usertrack.USER_TRACKED'),
        ),
        migrations.AlterUniqueTogether(
            name='user_tracked',
            unique_together=set([('application_id', 'user_id')]),
        ),
        migrations.AlterUniqueTogether(
            name='user_computer_attrib',
            unique_together=set([('computer_id', 'attrib_name')]),
        ),
        migrations.AlterUniqueTogether(
            name='user_computer',
            unique_together=set([('track_id', 'track_line_id')]),
        ),
    ]
