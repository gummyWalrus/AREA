import 'package:flutter/material.dart';
import 'package:flutter_datetime_picker/flutter_datetime_picker.dart';

class MyDateField extends StatelessWidget {
  const MyDateField({required this.name, required this.data, super.key});
  final Map data;
  final String name;
  @override
  Widget build(BuildContext context) {
    return TextButton(
        onPressed: () {
          DatePicker.showDateTimePicker(context, onChanged: (date) {
            data[name] = date;
          }, onConfirm: (date) {
            data[name] = date.toIso8601String();
          }, locale: LocaleType.fr);
        },
        child: Text(
          name,
          style: const TextStyle(color: Colors.blue),
        ));
  }
}
