# Generated by Django 3.2.3 on 2022-01-03 02:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('observation', models.TextField(blank=True, max_length=100, null=True)),
                ('total', models.FloatField()),
                ('status_delete', models.BooleanField(default=False)),
                ('cashRegister_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.cashregister')),
            ],
            options={
                'verbose_name': 'Purchase',
                'verbose_name_plural': 'Purchases',
                'db_table': 'purchase',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Purchase_Details_Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.PositiveBigIntegerField()),
                ('total', models.PositiveBigIntegerField()),
                ('status_delete', models.BooleanField(default=False)),
                ('product_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
                ('purchase_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='purchases.purchase')),
            ],
            options={
                'verbose_name': 'Purchase_Details_Product',
                'verbose_name_plural': 'Purchase_Details_Product',
                'db_table': 'PurchaseProduct',
                'ordering': ['id'],
            },
        ),
        migrations.AddField(
            model_name='purchase',
            name='product',
            field=models.ManyToManyField(through='purchases.Purchase_Details_Product', to='products.Product'),
        ),
        migrations.AddField(
            model_name='purchase',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
