# Generated by Django 5.0.2 on 2024-03-15 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("apps", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="employee",
            name="Department",
            field=models.CharField(
                choices=[
                    ("Nursing", "Nursing"),
                    ("Care", "Care"),
                    ("Dietary", "Dietary"),
                ],
                max_length=50,
            ),
        ),
    ]
