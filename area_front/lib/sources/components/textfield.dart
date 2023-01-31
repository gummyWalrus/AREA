import 'package:flutter/material.dart';

class MyTextField extends StatelessWidget {
  const MyTextField(
      {required this.index,
      required this.name,
      required this.data,
      required this.dataScheme,
      super.key});
  final Map data, dataScheme;
  final String name;
  final int index;
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Text('Current index : $index'),
        Text(name),
        TextFormField(
          controller: TextEditingController(),
          decoration:
              InputDecoration(hintText: dataScheme[name]['description']),
          onChanged: (value) {
            data[name] = value;
            print('Data : ${data[name]}');
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Invalid field';
            }
            return null;
          },
        ),
      ],
    );
  }
}
