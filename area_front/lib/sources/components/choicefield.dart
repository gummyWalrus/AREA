import 'package:flutter/material.dart';

class MyChoiceField extends StatelessWidget {
  MyChoiceField(
      {required this.index,
      required this.name,
      required this.dropDownValue,
      required this.newDropDownValue,
      required this.data,
      required this.dataScheme,
      super.key});
  final Map data, dataScheme;
  Map dropDownValue, newDropDownValue;
  final String name;
  final int index;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      // Text('Current index : $widget.index'),
      Text(name),
      DropdownButton<Map>(
        value: newDropDownValue.isNotEmpty ? newDropDownValue : dropDownValue,
        onChanged: (Map? value) {
          dropDownValue = value!;
          newDropDownValue = value;
          data[name] = value['value'];
        },
        items: dataScheme[name]['choices'].map<DropdownMenuItem<Map>>((items) {
          return DropdownMenuItem<Map>(
            value: items,
            child: Text(items['name']),
          );
        }).toList(),
      ),
    ]);
  }
}
